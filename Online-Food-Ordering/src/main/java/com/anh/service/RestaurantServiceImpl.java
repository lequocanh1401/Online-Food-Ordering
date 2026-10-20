package com.anh.service;

import com.anh.dto.RestaurantDto;
import com.anh.model.Address;
import com.anh.model.Restaurant;
import com.anh.model.User;
import com.anh.repository.AddressRepository;
import com.anh.repository.RestaurantRepository;
import com.anh.repository.UserRepository;
import com.anh.repository.ReviewRepository;
import com.anh.repository.OrderRepository;
import com.anh.request.CreateRestaurantRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private OrderRepository orderRepository;

    private void populateRestaurantRating(Restaurant restaurant) {
        if (restaurant != null) {
            Double avgRating = reviewRepository.getAverageRatingForRestaurant(restaurant.getId());
            Long count = reviewRepository.getCountForRestaurant(restaurant.getId());
            restaurant.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            restaurant.setTotalReviews(count != null ? count.intValue() : 0);
            
            Long revenue = orderRepository.calculateRevenueByRestaurantId(restaurant.getId());
            restaurant.setTotalRevenue(revenue != null ? revenue : 0L);
        }
    }

    private void populateRestaurantRatings(List<Restaurant> restaurants) {
        for (Restaurant r : restaurants) {
            populateRestaurantRating(r);
        }
    }

    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
        Address address = addressRepository.save(req.getAddress());

        Restaurant restaurant = new Restaurant();
        restaurant.setAddress(address);
        restaurant.setContactInformation(req.getContactInformation());
        restaurant.setCuisineType(req.getCuisineType());
        restaurant.setDescription(req.getDescription());
        restaurant.setImages(req.getImages());
        restaurant.setName(req.getName());
        restaurant.setOpeningHours(req.getOpeningHours());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOwner(user);
        restaurant.setOpen(true);

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        populateRestaurantRating(savedRestaurant);
        return savedRestaurant;
    }

    @Override
    public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedRestaurant) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId);

        if(updatedRestaurant.getCuisineType() != null) {
            restaurant.setCuisineType(updatedRestaurant.getCuisineType());
        }
        if(updatedRestaurant.getDescription() != null) {
            restaurant.setDescription(updatedRestaurant.getDescription());
        }
        if(updatedRestaurant.getName() != null) {
            restaurant.setName(updatedRestaurant.getName());
        }
        if(updatedRestaurant.getOpeningHours() != null) {
            restaurant.setOpeningHours(updatedRestaurant.getOpeningHours());
        }
        if(updatedRestaurant.getImages() != null) {
            restaurant.setImages(updatedRestaurant.getImages());
        }
        if(updatedRestaurant.getContactInformation() != null) {
            restaurant.setContactInformation(updatedRestaurant.getContactInformation());
        }
        if(updatedRestaurant.getAddress() != null) {
            Address existingAddress = restaurant.getAddress();
            Address updatedAddress = updatedRestaurant.getAddress();
            if (existingAddress == null) {
                existingAddress = new Address();
            }
            existingAddress.setStreetAddress(updatedAddress.getStreetAddress());
            existingAddress.setCity(updatedAddress.getCity());
            existingAddress.setCountry(updatedAddress.getCountry());
            existingAddress.setPostalCode(updatedAddress.getPostalCode());
            existingAddress.setStateProvince(updatedAddress.getStateProvince());
            restaurant.setAddress(addressRepository.save(existingAddress));
        }
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        populateRestaurantRating(savedRestaurant);
        return savedRestaurant;
    }

    @Override
    public void deleteRestaurant(Long restaurantId) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId);
        restaurantRepository.delete(restaurant);
    }

    @Override
    public List<Restaurant> getAllRestaurant() {
        List<Restaurant> list = restaurantRepository.findAll();
        populateRestaurantRatings(list);
        return list;
    }

    @Override
    public List<Restaurant> searchRestaurant(String keyword) {
        List<Restaurant> list = restaurantRepository.findBySearchQuery(keyword);
        populateRestaurantRatings(list);
        return list;
    }

    @Override
    public Restaurant findRestaurantById(Long id) throws Exception {
        Optional<Restaurant> opt = restaurantRepository.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Restaurant not found with id " + id);
        }
        Restaurant restaurant = opt.get();
        populateRestaurantRating(restaurant);
        return restaurant;
    }

    @Override
    public Restaurant getRestaurantByUserId(Long userId) throws Exception {
        Restaurant restaurant = restaurantRepository.findByOwnerId(userId);
        if (restaurant == null) {
            return null;
        }
        populateRestaurantRating(restaurant);
        return restaurant;
    }

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId);

        RestaurantDto dto = new RestaurantDto();
        dto.setDescription(restaurant.getDescription());
        dto.setImages(restaurant.getImages());
        dto.setTitle(restaurant.getName());
        dto.setId(restaurantId);

        boolean isFavorited = false;
        List<RestaurantDto> favorites = user.getFavorites();
        for (RestaurantDto favorite : favorites) {
            if (favorite.getId().equals(restaurantId)) {
                isFavorited = true;
                break;
            }
        }

        if (isFavorited) {
            favorites.removeIf(favorite -> favorite.getId().equals(restaurantId));
        } else {
            favorites.add(dto);
        }

        userRepository.save(user);
        return dto;
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id) throws Exception {
        Restaurant restaurant = findRestaurantById(id);
        restaurant.setOpen(!restaurant.isOpen());
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        populateRestaurantRating(savedRestaurant);
        return savedRestaurant;
    }
}