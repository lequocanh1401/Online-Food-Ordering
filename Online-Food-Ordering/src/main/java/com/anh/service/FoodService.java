package com.anh.service;

import com.anh.model.Category;
import com.anh.model.Food;
import com.anh.model.Restaurant;
import com.anh.request.CreateFoodRequest;

import java.util.List;

public interface FoodService {
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant);
    public void deleteFood(Long foodId) throws Exception;
    public List<Food> getRestaurantsFood(Long restaurantId, boolean isVegetarian, boolean isNonveg, boolean isSeasonal, String foodCategory);
    public List<Food> searchFood(String keyword);
    public Food findFoodById(Long foodId) throws Exception;
    public Food updateAvailibilityStatus(Long foodId) throws Exception;
    public Food updateFood(Long foodId, CreateFoodRequest req, Category category) throws Exception;
    public List<Food> getPopularFoods();
}