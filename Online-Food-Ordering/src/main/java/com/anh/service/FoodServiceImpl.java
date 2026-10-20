package com.anh.service;

import com.anh.model.Category;
import com.anh.model.Food;
import com.anh.model.Restaurant;
import com.anh.model.CartItem;
import com.anh.model.OrderItem;
import com.anh.repository.FoodRepository;
import com.anh.repository.CartItemRepository;
import com.anh.repository.OrderItemRepository;
import com.anh.request.CreateFoodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) {
        Food food = new Food();
        food.setFoodCategory(category);
        food.setRestaurant(restaurant);
        food.setDescription(req.getDescription());
        food.setImages(req.getImages());
        food.setName(req.getName());
        food.setPrice(req.getPrice());
        food.setIngredients(req.getIngredients());
        food.setSeasonal(req.isSeasional());
        food.setVegetarian(req.isVegetarian());
        food.setCreationDate(new Date());

        // Món mới tạo mặc định là còn hàng
        food.setAvailable(true);

        Food savedFood = foodRepository.save(food);
        restaurant.getFoods().add(savedFood);
        return savedFood;
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        
        // 1. Xóa món ăn khỏi các giỏ hàng hiện tại
        List<CartItem> cartItems = cartItemRepository.findAll().stream()
                .filter(item -> item.getFood() != null && item.getFood().getId().equals(foodId))
                .toList();
        for (CartItem cartItem : cartItems) {
            if (cartItem.getCart() != null) {
                cartItem.getCart().getItem().remove(cartItem);
            }
            cartItemRepository.delete(cartItem);
        }

        // 2. Xóa liên kết món ăn trong các đơn hàng cũ (giữ lịch sử)
        List<OrderItem> orderItems = orderItemRepository.findAll().stream()
                .filter(item -> item.getFood() != null && item.getFood().getId().equals(foodId))
                .toList();
        for (OrderItem orderItem : orderItems) {
            orderItem.setFood(null);
            orderItemRepository.save(orderItem);
        }

        // 3. Ngắt liên kết món ăn khỏi nhà hàng trước khi xóa để tránh lỗi khóa ngoại
        Restaurant restaurant = food.getRestaurant();
        if (restaurant != null) {
            restaurant.getFoods().remove(food);
            food.setRestaurant(null);
        }
        
        foodRepository.delete(food);
    }

    @Override
    public List<Food> getRestaurantsFood(Long restaurantId, boolean isVegetarian, boolean isNonveg, boolean isSeasonal, String foodCategory) {
        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

        if (isVegetarian) {
            foods = filterByVegetarian(foods, isVegetarian);
        }
        if (isNonveg) {
            foods = filterByNonveg(foods, isNonveg);
        }
        if (isSeasonal) {
            foods = filterBySeasonal(foods, isSeasonal);
        }
        if (foodCategory != null && !foodCategory.equals("")) {
            foods = filterByCategory(foods, foodCategory);
        }
        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food -> {
            if (food.getFoodCategory() != null) {
                return food.getFoodCategory().getName().equals(foodCategory);
            }
            return false;
        }).collect(Collectors.toList());
    }

    private List<Food> filterBySeasonal(List<Food> foods, boolean isSeasonal) {
        return foods.stream().filter(food -> food.isSeasonal() == isSeasonal).collect(Collectors.toList());
    }

    private List<Food> filterByNonveg(List<Food> foods, boolean isNonveg) {
        return foods.stream().filter(food -> !food.isVegetarian()).collect(Collectors.toList());
    }

    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegetarian) {
        return foods.stream().filter(food -> food.isVegetarian() == isVegetarian).collect(Collectors.toList());
    }

    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepository.searchFood(keyword);
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        Optional<Food> optionalFood = foodRepository.findById(foodId);
        if (optionalFood.isEmpty()) {
            throw new Exception("Food not exist...");
        }
        return optionalFood.get();
    }

    @Override
    public Food updateAvailibilityStatus(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        food.setAvailable(!food.isAvailable());
        return foodRepository.save(food);
    }

    @Override
    public Food updateFood(Long foodId, CreateFoodRequest req, Category category) throws Exception {
        Food food = findFoodById(foodId);
        food.setName(req.getName());
        food.setDescription(req.getDescription());
        food.setPrice(req.getPrice());
        food.setImages(req.getImages());
        food.setFoodCategory(category);
        food.setIngredients(req.getIngredients());
        food.setSeasonal(req.isSeasional());
        food.setVegetarian(req.isVegetarian());
        return foodRepository.save(food);
    }

    @Override
    public List<Food> getPopularFoods() {
        List<Food> popular = new ArrayList<>();
        try {
            List<Long> topIds = foodRepository.findTopSellingFoodIds();
            if (topIds != null) {
                for (Long id : topIds) {
                    Food f = foodRepository.findById(id).orElse(null);
                    if (f != null && f.isAvailable() && f.getRestaurant() != null) {
                        popular.add(f);
                    }
                    if (popular.size() >= 10) break;
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi query top selling foods: " + e.getMessage());
        }

        // Nếu chưa đủ món từ đơn hàng, lấy thêm các món có sẵn từ các nhà hàng
        if (popular.size() < 8) {
            List<Food> allFoods = foodRepository.findAll();
            for (Food f : allFoods) {
                if (f.isAvailable() && f.getRestaurant() != null) {
                    boolean alreadyExists = popular.stream().anyMatch(item -> item.getId().equals(f.getId()));
                    if (!alreadyExists) {
                        popular.add(f);
                    }
                }
                if (popular.size() >= 10) break;
            }
        }
        return popular;
    }
}