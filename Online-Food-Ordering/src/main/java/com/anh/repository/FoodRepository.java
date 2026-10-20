package com.anh.repository;

import com.anh.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByRestaurantId(Long restaurantId);

    @Query("SELECT f FROM Food f WHERE f.name LIKE %:keyword% OR f.foodCategory.name LIKE %:keyword%")
    List<Food> searchFood(@Param("keyword") String keyword);

    boolean existsByFoodCategoryId(Long categoryId);

    @Query("SELECT COUNT(f) > 0 FROM Food f JOIN f.ingredients i WHERE i.id = :ingredientId")
    boolean existsByIngredientId(@Param("ingredientId") Long ingredientId);

    @Query("SELECT oi.food.id FROM OrderItem oi WHERE oi.food IS NOT NULL GROUP BY oi.food.id ORDER BY SUM(oi.quantity) DESC")
    List<Long> findTopSellingFoodIds();
}