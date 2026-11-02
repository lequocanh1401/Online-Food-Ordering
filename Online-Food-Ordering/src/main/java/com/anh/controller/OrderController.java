package com.anh.controller;

import com.anh.model.Order;
import com.anh.model.User;
import com.anh.request.CreateOrderRequest;
import com.anh.response.PaymentResponse;
import com.anh.service.OrderService;
import com.anh.service.PaymentService;
import com.anh.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService; // Tiêm Service thanh toán vào đây

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest req,
                                         @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Order order = orderService.createOrder(req, user);

            PaymentResponse res = new PaymentResponse();
            if (req.getPaymentMethod() != null && "COD".equalsIgnoreCase(req.getPaymentMethod().trim())) {
                res.setPayment_url(null);
            } else {
                // Mặc định hoặc chọn thanh toán trực tuyến: gọi Stripe để lấy link thanh toán
                res = paymentService.createPaymentLink(order);
            }

            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("!!! ERROR IN createOrder !!!");
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/order/{orderId}/complete-payment")
    public ResponseEntity<Order> completePayment(@PathVariable Long orderId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.findOrderById(orderId);
        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new Exception("You do not have permission to update this order.");
        }
        Order updatedOrder = orderService.updateOrder(orderId, "PAID");
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    @GetMapping("/order/user")
    public ResponseEntity<?> getUsersOrder(
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            List<Order> orders = orderService.getUsersOrder(user.getId());
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("!!! ERROR IN getUsersOrder !!!");
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/order/{orderId}/payment-link")
    public ResponseEntity<?> createPaymentLink(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Order order = orderService.findOrderById(orderId);
            System.out.println("=== DEBUG PAYMENT LINK ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Logged-in User ID: " + (user != null ? user.getId() : "null"));
            System.out.println("Order Customer: " + (order.getCustomer() != null ? order.getCustomer().getId() : "null"));
            System.out.println("Order Total Price: " + order.getTotalPrice());
            System.out.println("Order Total Amount: " + order.getTotalAmount());
            System.out.println("==========================");

            if (order.getCustomer() == null) {
                return new ResponseEntity<>("Order customer is null", HttpStatus.BAD_REQUEST);
            }
            if (!order.getCustomer().getId().equals(user.getId())) {
                return new ResponseEntity<>("You do not have permission to access this order.", HttpStatus.FORBIDDEN);
            }
            
            // Nếu totalAmount bị null nhưng totalPrice có giá trị, đồng bộ lại để tránh crash Stripe
            if (order.getTotalAmount() == null && order.getTotalPrice() != null) {
                order.setTotalAmount(order.getTotalPrice());
            }

            PaymentResponse res = paymentService.createPaymentLink(order);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("!!! ERROR IN createPaymentLink !!!");
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Order order = orderService.findOrderById(orderId);
            if (!order.getCustomer().getId().equals(user.getId())) {
                return new ResponseEntity<>("You do not have permission to cancel this order.", HttpStatus.FORBIDDEN);
            }
            orderService.cancelOrder(orderId);
            return new ResponseEntity<>("Đã hủy đơn hàng thành công", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}