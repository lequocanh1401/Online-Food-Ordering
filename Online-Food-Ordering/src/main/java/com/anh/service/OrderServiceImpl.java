package com.anh.service;

import com.anh.config.OrderWebSocketHandler;
import com.anh.dto.OrderNotificationDTO;
import com.anh.model.*;
import com.anh.repository.*;
import com.anh.request.CreateOrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RestaurantService restaurantService;
    @Autowired
    private CartService cartService;
    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private IngredientsService ingredientsService;
    @Autowired
    private OrderWebSocketHandler orderWebSocketHandler;

    @Override
    public Order createOrder(CreateOrderRequest orderReq, User user) throws Exception {
        // Nạp managedUser để chạy trong Persistence Context/Session giao dịch hiện tại
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new Exception("User not found"));

        // Lấy giỏ hàng hiện tại của User trước để kiểm tra và lấy thông tin nhà hàng
        Cart cart = cartService.findCartByUserId(user.getId());
        if (cart == null || cart.getItem().isEmpty()) {
            throw new Exception("Cart is empty or not found");
        }

        // Tự động phân tích lấy Restaurant trực tiếp từ món ăn trong giỏ ở phía Backend
        Restaurant restaurant = null;
        CartItem firstCartItem = cart.getItem().get(0);
        if (firstCartItem.getFood() != null) {
            restaurant = firstCartItem.getFood().getRestaurant();
        }

        // Nếu giỏ hàng không có món nào hợp lệ hoặc lỗi, fallback về restaurantId từ frontend gửi lên
        if (restaurant == null && orderReq.getRestaurantId() != null) {
            restaurant = restaurantService.findRestaurantById(orderReq.getRestaurantId());
        }

        if (restaurant == null) {
            throw new Exception("Restaurant not found for this order");
        }

        if (!restaurant.isOpen()) {
            throw new Exception("Nhà hàng hiện đang tạm ngưng nhận đơn online. Vui lòng quay lại sau!");
        }

        // 1. Lưu địa chỉ giao hàng trước
        Address shippingAddress = orderReq.getDeliveryAddress();
        Address savedAddress = addressRepository.save(shippingAddress);

        // 2. Khởi tạo thực thể Order
        Order createdOrder = new Order();
        createdOrder.setCustomer(managedUser);
        createdOrder.setCreatedAt(new Date());
        createdOrder.setOrderStatus("PENDING");
        createdOrder.setDeliveryAddress(savedAddress);
        createdOrder.setRestaurant(restaurant);
        createdOrder.setPaymentMethod(orderReq.getPaymentMethod() != null && !orderReq.getPaymentMethod().trim().isEmpty() 
                ? orderReq.getPaymentMethod().trim().toUpperCase() 
                : "STRIPE");

        // Sẽ được thiết lập cùng với totalPrice sau khi tính toán xong

        List<OrderItem> orderItems = new ArrayList<>();

        for(CartItem cartItem : cart.getItem()) { // Sử dụng cart.getItems() nếu Model của bạn đặt số nhiều
            OrderItem orderItem = new OrderItem();
            orderItem.setFood(cartItem.getFood());
            
            // Copy danh sách nguyên liệu sang thực thể mới để tránh lỗi chia sẻ bộ sưu tập của Hibernate
            if (cartItem.getIngredients() != null) {
                orderItem.setIngredients(new ArrayList<>(cartItem.getIngredients()));
            } else {
                orderItem.setIngredients(new ArrayList<>());
            }
            
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);
        }

        Long totalPrice = cartService.calculateCartTotals(cart);

        // Áp dụng Coupon giảm giá nếu có gửi kèm trong yêu cầu đặt hàng
        if (orderReq.getCouponCode() != null && !orderReq.getCouponCode().trim().isEmpty()) {
            java.util.Optional<com.anh.model.Coupon> couponOpt = couponRepository.findByCodeAndRestaurantId(orderReq.getCouponCode(), restaurant.getId());
            if (!couponOpt.isPresent()) {
                // Kiểm tra mã trong hệ thống (mã toàn sàn hoặc mã của quán có món trong đơn)
                java.util.Optional<com.anh.model.Coupon> globalCouponOpt = couponRepository.findByCode(orderReq.getCouponCode());
                if (globalCouponOpt.isPresent()) {
                    couponOpt = globalCouponOpt;
                }
            }
            if (couponOpt.isPresent()) {
                com.anh.model.Coupon coupon = couponOpt.get();
                if (coupon.isActive()) {
                    long minOrderVal = coupon.getMinimumOrderValue() != null ? coupon.getMinimumOrderValue() : 0L;
                    long applicableTotal = 0L;

                    if (coupon.getRestaurant() != null) {
                        Long couponRestId = coupon.getRestaurant().getId();
                        for (OrderItem oi : orderItems) {
                            if (oi.getFood() != null && oi.getFood().getRestaurant() != null && couponRestId.equals(oi.getFood().getRestaurant().getId())) {
                                applicableTotal += oi.getTotalPrice();
                            }
                        }
                        if (applicableTotal == 0) {
                            throw new Exception("Mã giảm giá này chỉ áp dụng cho các món ăn của nhà hàng " + coupon.getRestaurant().getName());
                        }
                        if (applicableTotal < minOrderVal) {
                            throw new Exception("Tổng tiền các món của nhà hàng " + coupon.getRestaurant().getName() + " chưa đạt giá trị tối thiểu " + minOrderVal + " đ để áp dụng mã này.");
                        }
                    } else {
                        applicableTotal = totalPrice;
                        if (applicableTotal < minOrderVal) {
                            throw new Exception("Đơn hàng chưa đạt giá trị tối thiểu " + minOrderVal + " đ để áp dụng mã giảm giá này.");
                        }
                    }

                    long discount = 0;
                    long discVal = coupon.getDiscountValue() != null ? coupon.getDiscountValue() : 0L;
                    String discType = coupon.getDiscountType() != null ? coupon.getDiscountType() : "";
                    if ("PERCENTAGE".equalsIgnoreCase(discType)) {
                        discount = (applicableTotal * discVal) / 100;
                    } else if ("FLAT".equalsIgnoreCase(discType)) {
                        discount = discVal;
                    }
                    // Đảm bảo số tiền giảm giá không âm và không vượt quá tổng tiền của món áp dụng
                    discount = Math.max(0, Math.min(discount, applicableTotal));
                    createdOrder.setCouponCode(coupon.getCode());
                    createdOrder.setDiscountAmount(discount);
                    totalPrice = Math.max(0, totalPrice - discount);
                }
            }
        }

        createdOrder.setItems(orderItems);
        createdOrder.setTotalPrice(totalPrice);
        createdOrder.setTotalAmount(totalPrice);

        Order savedOrder = orderRepository.save(createdOrder);

        // Smart Inventory (Step 2): Tự động trừ tồn kho nguyên liệu khi tạo đơn hàng
        try {
            ingredientsService.depleteStockForOrder(savedOrder);
        } catch (Exception e) {
            System.err.println("Lỗi tự động trừ kho nguyên liệu: " + e.getMessage());
        }

        // Step 3: Real-time Order Alert qua WebSocket
        try {
            OrderNotificationDTO notification = new OrderNotificationDTO();
            notification.setType("NEW_ORDER");
            notification.setOrderId(savedOrder.getId());
            notification.setRestaurantId(restaurant.getId());
            notification.setCustomerName(managedUser.getFullName() != null ? managedUser.getFullName() : managedUser.getEmail());
            notification.setCustomerEmail(managedUser.getEmail());
            if (savedOrder.getDeliveryAddress() != null) {
                String street = savedOrder.getDeliveryAddress().getStreetAddress() != null ? savedOrder.getDeliveryAddress().getStreetAddress() : "";
                String city = savedOrder.getDeliveryAddress().getCity() != null ? savedOrder.getDeliveryAddress().getCity() : "";
                notification.setDeliveryAddress((street + " " + city).trim());
            }
            notification.setTotalAmount(savedOrder.getTotalAmount() != null ? savedOrder.getTotalAmount() : savedOrder.getTotalPrice());
            notification.setTotalItemCount(orderItems.size());
            notification.setOrderStatus(savedOrder.getOrderStatus());
            notification.setCreatedAt(savedOrder.getCreatedAt() != null ? savedOrder.getCreatedAt() : new Date());

            List<String> itemsSummary = new ArrayList<>();
            for (OrderItem oi : orderItems) {
                String foodName = (oi.getFood() != null && oi.getFood().getName() != null) ? oi.getFood().getName() : "Món ăn";
                itemsSummary.add(oi.getQuantity() + "x " + foodName);
            }
            notification.setItemsSummary(itemsSummary);

            orderWebSocketHandler.broadcastToRestaurant(restaurant.getId(), notification);
        } catch (Exception e) {
            System.err.println("Lỗi phát sóng WebSocket đơn hàng mới: " + e.getMessage());
        }

        // Làm sạch giỏ hàng của User sau khi đặt hàng thành công
        cartService.clearCart(user.getId());

        return savedOrder;
    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        String currentStatus = order.getOrderStatus();

        // 1. Chặn nếu đơn đã ở trạng thái kết thúc (Terminal State)
        if ("CANCELLED".equalsIgnoreCase(currentStatus) || "CANCELED".equalsIgnoreCase(currentStatus)) {
            throw new Exception("Đơn hàng này đã bị hủy, không thể thay đổi trạng thái!");
        }
        if ("COMPLETED".equalsIgnoreCase(currentStatus) || "DELIVERED".equalsIgnoreCase(currentStatus)) {
            throw new Exception("Đơn hàng này đã hoàn thành, không thể thay đổi trạng thái!");
        }

        // 2. Chặn đơn Stripe PENDING nhảy cóc sang OUT_FOR_DELIVERY / COMPLETED khi chưa thanh toán (chỉ cho phép PAID hoặc CANCELLED)
        if ("STRIPE".equalsIgnoreCase(order.getPaymentMethod()) && "PENDING".equalsIgnoreCase(currentStatus)) {
            if (!"PAID".equalsIgnoreCase(orderStatus) && !"CANCELLED".equalsIgnoreCase(orderStatus) && !"CANCELED".equalsIgnoreCase(orderStatus)) {
                throw new Exception("Đơn hàng đang chờ khách quẹt thẻ Stripe. Quán chỉ có thể xác nhận thanh toán (PAID) hoặc hủy đơn nếu khách không thanh toán.");
            }
        }

        if(orderStatus.equals("OUT_FOR_DELIVERY") ||
                orderStatus.equals("DELIVERED") ||
                orderStatus.equals("COMPLETED") ||
                orderStatus.equals("PENDING") ||
                orderStatus.equals("CANCELLED") ||
                orderStatus.equals("CANCELED") ||
                orderStatus.equals("PAID")) {

            if ("CANCELLED".equalsIgnoreCase(orderStatus) || "CANCELED".equalsIgnoreCase(orderStatus)) {
                try {
                    ingredientsService.restoreStockForOrder(order);
                } catch (Exception e) {
                    System.err.println("Lỗi hoàn kho khi quán hủy đơn: " + e.getMessage());
                }
            }

            order.setOrderStatus(orderStatus);
            if ("PAID".equalsIgnoreCase(orderStatus) && order.getPaymentMethod() == null) {
                order.setPaymentMethod("STRIPE");
            }
            Order updated = orderRepository.save(order);

            // Step 3: Phát sóng thay đổi trạng thái đơn qua WebSocket
            try {
                if (updated.getRestaurant() != null) {
                    OrderNotificationDTO statusNotification = new OrderNotificationDTO();
                    statusNotification.setType("ORDER_STATUS_CHANGED");
                    statusNotification.setOrderId(orderId);
                    statusNotification.setRestaurantId(updated.getRestaurant().getId());
                    statusNotification.setOrderStatus(orderStatus);
                    orderWebSocketHandler.broadcastToRestaurant(updated.getRestaurant().getId(), statusNotification);
                }
            } catch (Exception e) {
                System.err.println("Lỗi phát sóng WebSocket trạng thái: " + e.getMessage());
            }

            return updated;
        }
        throw new Exception("Please select a valid order status");
    }

    @Override
    public void cancelOrder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);
        if (!"PENDING".equals(order.getOrderStatus())) {
            throw new Exception("Chỉ có thể hủy/xóa đơn hàng chưa thanh toán.");
        }
        // Smart Inventory (Step 2): Tự động hoàn lại tồn kho nguyên liệu khi hủy đơn hàng
        try {
            ingredientsService.restoreStockForOrder(order);
        } catch (Exception e) {
            System.err.println("Lỗi hoàn kho khi hủy đơn: " + e.getMessage());
        }

        // Step 3: Phát sóng thông báo hủy đơn qua WebSocket
        try {
            if (order.getRestaurant() != null) {
                OrderNotificationDTO cancelNotification = new OrderNotificationDTO();
                cancelNotification.setType("ORDER_CANCELLED");
                cancelNotification.setOrderId(orderId);
                cancelNotification.setRestaurantId(order.getRestaurant().getId());
                cancelNotification.setOrderStatus("CANCELLED");
                orderWebSocketHandler.broadcastToRestaurant(order.getRestaurant().getId(), cancelNotification);
            }
        } catch (Exception e) {
            System.err.println("Lỗi phát sóng WebSocket hủy đơn: " + e.getMessage());
        }

        orderRepository.deleteById(orderId);
    }

    @Override
    public List<Order> getUsersOrder(Long userId) throws Exception {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) throws Exception {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        if(orderStatus != null && !orderStatus.trim().isEmpty() && !orderStatus.equalsIgnoreCase("ALL")) {
            orders = orders.stream().filter(order -> order.getOrderStatus().equalsIgnoreCase(orderStatus)).toList();
        }
        return orders;
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if(optionalOrder.isEmpty()) {
            throw new Exception("Order not found");
        }
        return optionalOrder.get();
    }
}