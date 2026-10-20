package com.anh.service;

import com.anh.model.IngredientCategory;
import com.anh.model.IngredientsItem;
import com.anh.model.InventoryLog;
import com.anh.model.Order;

import java.util.List;

public interface IngredientsService {
    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception;
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception;
    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long id) throws Exception;

    public IngredientsItem createIngredientItem(Long restaurantId, String ingredientName, Long categoryId) throws Exception;
    public IngredientsItem createIngredientItem(Long restaurantId, String ingredientName, Long categoryId, Double quantity, String unit, Double minThreshold) throws Exception;
    public List<IngredientsItem> findRestaurantsIngredients(Long restaurantId);
    public IngredientsItem updateStock(Long id) throws Exception;
    public IngredientsItem findIngredientItemById(Long id) throws Exception;
    public IngredientCategory updateIngredientCategory(Long categoryId, String name) throws Exception;
    public void deleteIngredientCategory(Long categoryId) throws Exception;
    public IngredientsItem updateIngredientItem(Long ingredientId, String name, Long categoryId) throws Exception;
    public IngredientsItem updateIngredientItem(Long ingredientId, String name, Long categoryId, Double quantity, String unit, Double minThreshold) throws Exception;
    public void deleteIngredientItem(Long ingredientId) throws Exception;

    // Smart Inventory & Depletion (Step 2)
    public IngredientsItem importStock(Long ingredientId, Double additionalQuantity, String note) throws Exception;
    public void depleteStockForOrder(Order order);
    public void restoreStockForOrder(Order order);
    public List<InventoryLog> getInventoryLogs(Long restaurantId);
    public List<IngredientsItem> getLowStockIngredients(Long restaurantId);
}