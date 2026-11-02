package com.anh.repository;

import com.anh.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Tìm lịch sử đặt hàng của một khách hàng (mới nhất theo thời gian lên đầu)
    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId ORDER BY o.createdAt DESC, o.id DESC")
    public List<Order> findByCustomerId(@Param("userId") Long userId);

    // Tìm tất cả các đơn hàng đổ về một nhà hàng cụ thể (mới nhất theo thời gian lên đầu)
    @Query("SELECT o FROM Order o WHERE o.restaurant.id = :restaurantId ORDER BY o.createdAt DESC, o.id DESC")
    public List<Order> findByRestaurantId(@Param("restaurantId") Long restaurantId);

    // Kiểm tra xem địa chỉ có được liên kết với đơn hàng nào không
    boolean existsByDeliveryAddressId(Long addressId);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.restaurant.id = :restaurantId AND (o.orderStatus = 'COMPLETED' OR o.orderStatus = 'DELIVERED')")
    Long calculateRevenueByRestaurantId(@Param("restaurantId") Long restaurantId);
}