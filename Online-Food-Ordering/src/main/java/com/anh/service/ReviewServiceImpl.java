package com.anh.service;

import com.anh.dto.ReviewResponseDto;
import com.anh.model.Food;
import com.anh.model.Order;
import com.anh.model.Restaurant;
import com.anh.model.Review;
import com.anh.model.User;
import com.anh.repository.FoodRepository;
import com.anh.repository.OrderRepository;
import com.anh.repository.RestaurantRepository;
import com.anh.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public Review createReview(Review review, User user, Long restaurantId, Long foodId) throws Exception {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantId);
        if (restaurantOpt.isEmpty()) {
            throw new Exception("Không tìm thấy thông tin nhà hàng.");
        }
        Restaurant restaurant = restaurantOpt.get();

        Food food = null;
        if (foodId != null) {
            Optional<Food> foodOpt = foodRepository.findById(foodId);
            if (foodOpt.isEmpty()) {
                throw new Exception("Không tìm thấy thông tin món ăn.");
            }
            food = foodOpt.get();
        }

        // Kiểm tra xem user có đơn hàng nào ở nhà hàng này đã hoàn thành hay chưa
        List<Order> userOrders = orderRepository.findByCustomerId(user.getId());
        
        boolean hasCompletedOrder = userOrders.stream()
            .filter(order -> order.getRestaurant().getId().equals(restaurantId))
            .filter(order -> "COMPLETED".equals(order.getOrderStatus()) || "DELIVERED".equals(order.getOrderStatus()))
            .anyMatch(order -> {
                if (foodId == null) return true;
                return order.getItems().stream()
                    .anyMatch(item -> item.getFood().getId().equals(foodId));
            });

        if (!hasCompletedOrder) {
            if (foodId != null) {
                throw new Exception("Bạn chỉ có thể đánh giá món ăn này sau khi đã mua món và đơn hàng được giao thành công.");
            } else {
                throw new Exception("Bạn chỉ có thể đánh giá nhà hàng này sau khi đã mua hàng và đơn hàng được giao thành công.");
            }
        }

        Review newReview = new Review();
        newReview.setCustomer(user);
        newReview.setRestaurant(restaurant);
        newReview.setFood(food);
        newReview.setRating(review.getRating());
        newReview.setComment(review.getComment());
        newReview.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(newReview);
    }

    @Override
    public ReviewResponseDto getRestaurantReviews(Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        Double avgRating = reviewRepository.getAverageRatingForRestaurant(restaurantId);
        Long count = reviewRepository.getCountForRestaurant(restaurantId);

        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setReviews(reviews);
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        dto.setTotalReviews(count != null ? count.intValue() : 0);
        return dto;
    }

    @Override
    public ReviewResponseDto getFoodReviews(Long foodId) {
        List<Review> reviews = reviewRepository.findByFoodIdOrderByCreatedAtDesc(foodId);
        Double avgRating = reviewRepository.getAverageRatingForFood(foodId);
        Long count = reviewRepository.getCountForFood(foodId);

        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setReviews(reviews);
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        dto.setTotalReviews(count != null ? count.intValue() : 0);
        return dto;
    }

    @Override
    public Review updateReview(Long reviewId, Review updatedReview, User user) throws Exception {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            throw new Exception("Không tìm thấy đánh giá.");
        }
        Review review = reviewOpt.get();
        if (!review.getCustomer().getId().equals(user.getId())) {
            throw new Exception("Bạn không có quyền sửa đánh giá của người khác.");
        }
        review.setRating(updatedReview.getRating());
        review.setComment(updatedReview.getComment());
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long reviewId, User user) throws Exception {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            throw new Exception("Không tìm thấy đánh giá.");
        }
        Review review = reviewOpt.get();
        if (!review.getCustomer().getId().equals(user.getId()) && user.getRole() != com.anh.model.USER_ROLE.ROLE_ADMIN) {
            throw new Exception("Bạn không có quyền xóa đánh giá của người khác.");
        }
        reviewRepository.delete(review);
    }
}
