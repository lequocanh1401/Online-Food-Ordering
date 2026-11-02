package com.anh.service;

import com.anh.model.Category;
import com.anh.model.Restaurant;
import com.anh.repository.CategoryRepository;
import com.anh.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private RestaurantService restaurantService;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private FoodRepository foodRepository;

    @Override
    public Category createCategory(String name, Long userId) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantByUserId(userId);
        if (restaurant == null) {
            throw new Exception("Restaurant not found with owner id " + userId);
        }
        String trimmedName = name != null ? name.trim() : "";
        if (trimmedName.isEmpty()) {
            throw new Exception("Tên danh mục không được để trống.");
        }
        List<Category> existing = categoryRepository.findByRestaurantId(restaurant.getId());
        for (Category c : existing) {
            if (c.getName() != null && c.getName().trim().equalsIgnoreCase(trimmedName)) {
                throw new Exception("Nhà hàng đã có danh mục '" + trimmedName + "' rồi!");
            }
        }
        Category category = new Category();
        category.setName(trimmedName);
        category.setRestaurant(restaurant);
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long id) throws Exception {
        return categoryRepository.findByRestaurantId(id);
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new Exception("Category not found");
        }
        return optionalCategory.get();
    }

    @Override
    public Category updateCategory(Long categoryId, String name) throws Exception {
        Category category = findCategoryById(categoryId);
        category.setName(name);
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long categoryId) throws Exception {
        if (foodRepository.existsByFoodCategoryId(categoryId)) {
            throw new Exception("Không thể xóa danh mục này vì đang có món ăn sử dụng nó.");
        }
        Category category = findCategoryById(categoryId);
        categoryRepository.delete(category);
    }
}