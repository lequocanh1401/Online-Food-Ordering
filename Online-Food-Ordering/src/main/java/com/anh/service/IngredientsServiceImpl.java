package com.anh.service;

import com.anh.model.IngredientCategory;
import com.anh.model.IngredientsItem;
import com.anh.model.Restaurant;
import com.anh.repository.IngredientCategoryRepository;
import com.anh.repository.IngredientItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientsServiceImpl implements IngredientsService {

    @Autowired
    private IngredientCategoryRepository ingredientCategoryRepository;

    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Autowired
    private com.anh.repository.InventoryLogRepository inventoryLogRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);

        IngredientCategory category = new IngredientCategory();
        category.setRestaurant(restaurant);
        category.setName(name);

        return ingredientCategoryRepository.save(category);
    }

    @Override
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception {
        Optional<IngredientCategory> opt = ingredientCategoryRepository.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Ingredient category not found with id: " + id);
        }
        return opt.get();
    }

    @Override
    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long id) throws Exception {
        // Kiểm tra xem nhà hàng có tồn tại không trước khi lấy danh mục
        restaurantService.findRestaurantById(id);
        return ingredientCategoryRepository.findByRestaurantId(id);
    }

    @Override
    public IngredientsItem createIngredientItem(Long restaurantId, String ingredientName, Long categoryId) throws Exception {
        return createIngredientItem(restaurantId, ingredientName, categoryId, 50.0, "phần", 10.0);
    }

    @Override
    public IngredientsItem createIngredientItem(Long restaurantId, String ingredientName, Long categoryId, Double quantity, String unit, Double minThreshold) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        IngredientCategory category = findIngredientCategoryById(categoryId);

        IngredientsItem item = new IngredientsItem();
        item.setName(ingredientName);
        item.setRestaurant(restaurant);
        item.setCategory(category);
        item.setQuantity(quantity != null ? Math.max(0.0, quantity) : 50.0);
        item.setUnit((unit != null && !unit.trim().isEmpty()) ? unit.trim() : "phần");
        item.setMinThreshold(minThreshold != null ? Math.max(0.0, minThreshold) : 10.0);
        item.setInStock(item.getQuantity() > 0.0);

        IngredientsItem savedItem = ingredientItemRepository.save(item);
        category.getIngredients().add(savedItem);

        // Ghi nhận log khởi tạo kho ban đầu
        try {
            com.anh.model.InventoryLog log = new com.anh.model.InventoryLog();
            log.setRestaurantId(restaurantId);
            log.setIngredientId(savedItem.getId());
            log.setIngredientName(savedItem.getName());
            log.setActionType("INITIAL_IMPORT");
            log.setChangeAmount(savedItem.getQuantity());
            log.setRemainingQuantity(savedItem.getQuantity());
            log.setUnit(savedItem.getUnit());
            log.setNote("Khởi tạo nguyên liệu mới trong hệ thống");
            log.setCreatedAt(java.time.LocalDateTime.now());
            inventoryLogRepository.save(log);
        } catch (Exception ignored) {}

        return savedItem;
    }

    @Override
    public List<IngredientsItem> findRestaurantsIngredients(Long restaurantId) {
        return ingredientItemRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public IngredientsItem updateStock(Long id) throws Exception {
        Optional<IngredientsItem> opt = ingredientItemRepository.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Ingredient not found with id: " + id);
        }
        IngredientsItem item = opt.get();
        item.setInStock(!item.isInStock()); // Đảo trạng thái Còn hàng / Hết hàng
        return ingredientItemRepository.save(item);
    }

    @Autowired
    private com.anh.repository.FoodRepository foodRepository;

    @Override
    public IngredientsItem findIngredientItemById(Long id) throws Exception {
        Optional<IngredientsItem> opt = ingredientItemRepository.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Ingredient not found with id: " + id);
        }
        return opt.get();
    }

    @Override
    public IngredientCategory updateIngredientCategory(Long categoryId, String name) throws Exception {
        IngredientCategory category = findIngredientCategoryById(categoryId);
        category.setName(name);
        return ingredientCategoryRepository.save(category);
    }

    @Override
    public void deleteIngredientCategory(Long categoryId) throws Exception {
        IngredientCategory category = findIngredientCategoryById(categoryId);
        if (!category.getIngredients().isEmpty()) {
            throw new Exception("Không thể xóa danh mục này vì vẫn còn nguyên liệu bên trong.");
        }
        ingredientCategoryRepository.delete(category);
    }

    @Override
    public IngredientsItem updateIngredientItem(Long ingredientId, String name, Long categoryId) throws Exception {
        return updateIngredientItem(ingredientId, name, categoryId, null, null, null);
    }

    @Override
    public IngredientsItem updateIngredientItem(Long ingredientId, String name, Long categoryId, Double quantity, String unit, Double minThreshold) throws Exception {
        IngredientsItem item = findIngredientItemById(ingredientId);
        IngredientCategory category = findIngredientCategoryById(categoryId);
        item.setName(name);
        item.setCategory(category);
        if (quantity != null) {
            item.setQuantity(Math.max(0.0, quantity));
            item.setInStock(item.getQuantity() > 0.0);
        }
        if (unit != null && !unit.trim().isEmpty()) {
            item.setUnit(unit.trim());
        }
        if (minThreshold != null) {
            item.setMinThreshold(Math.max(0.0, minThreshold));
        }
        return ingredientItemRepository.save(item);
    }

    @Override
    public void deleteIngredientItem(Long ingredientId) throws Exception {
        if (foodRepository.existsByIngredientId(ingredientId)) {
            throw new Exception("Không thể xóa nguyên liệu này vì có món ăn đang sử dụng nó.");
        }
        IngredientsItem item = findIngredientItemById(ingredientId);
        ingredientItemRepository.delete(item);
    }

    @Override
    public IngredientsItem importStock(Long ingredientId, Double additionalQuantity, String note) throws Exception {
        if (additionalQuantity == null || additionalQuantity <= 0) {
            throw new Exception("Số lượng nhập kho phải lớn hơn 0");
        }
        IngredientsItem item = findIngredientItemById(ingredientId);
        Double oldQty = item.getQuantity();
        Double newQty = oldQty + additionalQuantity;
        item.setQuantity(newQty);
        item.setInStock(newQty > 0.0);
        IngredientsItem saved = ingredientItemRepository.save(item);

        try {
            com.anh.model.InventoryLog log = new com.anh.model.InventoryLog();
            log.setRestaurantId(item.getRestaurant() != null ? item.getRestaurant().getId() : null);
            log.setIngredientId(item.getId());
            log.setIngredientName(item.getName());
            log.setActionType("MANUAL_IMPORT");
            log.setChangeAmount(additionalQuantity);
            log.setRemainingQuantity(newQty);
            log.setUnit(item.getUnit());
            log.setNote(note != null && !note.trim().isEmpty() ? note.trim() : "Chủ quán nhập thêm nguyên liệu vào kho bếp");
            log.setCreatedAt(java.time.LocalDateTime.now());
            inventoryLogRepository.save(log);
        } catch (Exception ignored) {}

        return saved;
    }

    @Override
    public void depleteStockForOrder(com.anh.model.Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return;
        }

        Long restaurantId = order.getRestaurant() != null ? order.getRestaurant().getId() : null;

        for (com.anh.model.OrderItem orderItem : order.getItems()) {
            if (orderItem.getFood() == null || orderItem.getFood().getId() == null) continue;

            Optional<com.anh.model.Food> foodOpt = foodRepository.findById(orderItem.getFood().getId());
            if (foodOpt.isEmpty()) continue;
            com.anh.model.Food food = foodOpt.get();

            List<IngredientsItem> ingredients = food.getIngredients();
            if (ingredients == null || ingredients.isEmpty()) continue;

            int orderQty = orderItem.getQuantity() > 0 ? orderItem.getQuantity() : 1;

            for (IngredientsItem ing : ingredients) {
                if (ing.getId() == null) continue;
                Optional<IngredientsItem> liveIngOpt = ingredientItemRepository.findById(ing.getId());
                if (liveIngOpt.isEmpty()) continue;

                IngredientsItem liveIng = liveIngOpt.get();
                double consumed = (double) orderQty;
                double currentQty = liveIng.getQuantity();
                double newQty = Math.max(0.0, currentQty - consumed);

                liveIng.setQuantity(newQty);
                if (newQty <= 0.0) {
                    liveIng.setInStock(false);
                }
                ingredientItemRepository.save(liveIng);

                try {
                    com.anh.model.InventoryLog log = new com.anh.model.InventoryLog();
                    log.setRestaurantId(restaurantId);
                    log.setIngredientId(liveIng.getId());
                    log.setIngredientName(liveIng.getName());
                    log.setActionType("AUTO_DEPLETION");
                    log.setChangeAmount(-consumed);
                    log.setRemainingQuantity(newQty);
                    log.setUnit(liveIng.getUnit());
                    log.setOrderId(order.getId());
                    log.setNote("Tự động trừ kho " + consumed + " " + liveIng.getUnit() + " khi phục vụ món '" + food.getName() + "' (Đơn #" + order.getId() + ")");
                    log.setCreatedAt(java.time.LocalDateTime.now());
                    inventoryLogRepository.save(log);
                } catch (Exception ignored) {}
            }
        }
    }

    @Override
    public void restoreStockForOrder(com.anh.model.Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return;
        }

        Long restaurantId = order.getRestaurant() != null ? order.getRestaurant().getId() : null;

        for (com.anh.model.OrderItem orderItem : order.getItems()) {
            if (orderItem.getFood() == null || orderItem.getFood().getId() == null) continue;

            Optional<com.anh.model.Food> foodOpt = foodRepository.findById(orderItem.getFood().getId());
            if (foodOpt.isEmpty()) continue;
            com.anh.model.Food food = foodOpt.get();

            List<IngredientsItem> ingredients = food.getIngredients();
            if (ingredients == null || ingredients.isEmpty()) continue;

            int orderQty = orderItem.getQuantity() > 0 ? orderItem.getQuantity() : 1;

            for (IngredientsItem ing : ingredients) {
                if (ing.getId() == null) continue;
                Optional<IngredientsItem> liveIngOpt = ingredientItemRepository.findById(ing.getId());
                if (liveIngOpt.isEmpty()) continue;

                IngredientsItem liveIng = liveIngOpt.get();
                double restored = (double) orderQty;
                double currentQty = liveIng.getQuantity();
                double newQty = currentQty + restored;

                liveIng.setQuantity(newQty);
                if (newQty > 0.0) {
                    liveIng.setInStock(true);
                }
                ingredientItemRepository.save(liveIng);

                try {
                    com.anh.model.InventoryLog log = new com.anh.model.InventoryLog();
                    log.setRestaurantId(restaurantId);
                    log.setIngredientId(liveIng.getId());
                    log.setIngredientName(liveIng.getName());
                    log.setActionType("AUTO_RESTORE");
                    log.setChangeAmount(restored);
                    log.setRemainingQuantity(newQty);
                    log.setUnit(liveIng.getUnit());
                    log.setOrderId(order.getId());
                    log.setNote("Hoàn kho tự động " + restored + " " + liveIng.getUnit() + " do Đơn #" + order.getId() + " bị hủy");
                    log.setCreatedAt(java.time.LocalDateTime.now());
                    inventoryLogRepository.save(log);
                } catch (Exception ignored) {}
            }
        }
    }

    @Override
    public List<com.anh.model.InventoryLog> getInventoryLogs(Long restaurantId) {
        return inventoryLogRepository.findTop50ByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    @Override
    public List<IngredientsItem> getLowStockIngredients(Long restaurantId) {
        List<IngredientsItem> all = findRestaurantsIngredients(restaurantId);
        return all.stream()
                .filter(i -> i.isLowStock() || i.isOutOfStock())
                .toList();
    }
}