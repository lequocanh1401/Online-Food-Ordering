package com.anh.repository;

import com.anh.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantIdAndFoodIsNullOrderByCreatedAtDesc(Long restaurantId);
    
    List<Review> findByFoodIdOrderByCreatedAtDesc(Long foodId);
    
    List<Review> findByCustomerId(Long userId);
    
    List<Review> findByCustomerIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.restaurant.id = :restaurantId AND r.food IS NULL")
    Double getAverageRatingForRestaurant(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.food.id = :foodId")
    Double getAverageRatingForFood(@Param("foodId") Long foodId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.restaurant.id = :restaurantId AND r.food IS NULL")
    Long getCountForRestaurant(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.food.id = :foodId")
    Long getCountForFood(@Param("foodId") Long foodId);
}
