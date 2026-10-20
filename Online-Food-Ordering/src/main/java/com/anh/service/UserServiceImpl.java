package com.anh.service;

import com.anh.config.JwtProvider;
import com.anh.model.Address;
import com.anh.model.User;
import com.anh.model.Cart;
import com.anh.model.Review;
import com.anh.model.Restaurant;
import com.anh.repository.AddressRepository;
import com.anh.repository.OrderRepository;
import com.anh.repository.UserRepository;
import com.anh.repository.CartRepository;
import com.anh.repository.ReviewRepository;
import com.anh.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        // 1. Dịch token lấy email
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        // 2. Dùng email tìm User trong database
        User user = findUserByEmail(email);
        if (user != null) {
            user.getFavorites().size();
            user.getAddresses().size();
        }
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found");
        }
        user.getFavorites().size();
        user.getAddresses().size();
        return user;
    }

    @Override
    public User addAddressToUser(String jwt, Address address) throws Exception {
        User user = findUserByJwtToken(jwt);
        Address savedAddress = addressRepository.save(address);
        user.getAddresses().add(savedAddress);
        return userRepository.save(user);
    }

    @Override
    public User deleteAddressFromUser(String jwt, Long addressId) throws Exception {
        User user = findUserByJwtToken(jwt);
        Address addressToRemove = null;
        for (Address addr : user.getAddresses()) {
            if (addr.getId().equals(addressId)) {
                addressToRemove = addr;
                break;
            }
        }
        if (addressToRemove != null) {
            user.getAddresses().remove(addressToRemove);
            User savedUser = userRepository.save(user);
            
            // Xóa địa chỉ khỏi database nếu địa chỉ này chưa từng được liên kết với đơn hàng nào
            boolean isReferencedByOrder = orderRepository.existsByDeliveryAddressId(addressId);
            if (!isReferencedByOrder) {
                addressRepository.delete(addressToRemove);
            }
            return savedUser;
        } else {
            throw new Exception("Address not found or does not belong to this user");
        }
    }

    @Override
    public User updateAddress(String jwt, Long addressId, Address addressDetails) throws Exception {
        User user = findUserByJwtToken(jwt);
        Address addressToUpdate = null;
        for (Address addr : user.getAddresses()) {
            if (addr.getId().equals(addressId)) {
                addressToUpdate = addr;
                break;
            }
        }
        if (addressToUpdate != null) {
            addressToUpdate.setStreetAddress(addressDetails.getStreetAddress());
            addressToUpdate.setCity(addressDetails.getCity());
            addressToUpdate.setStateProvince(addressDetails.getStateProvince());
            addressToUpdate.setPostalCode(addressDetails.getPostalCode());
            addressToUpdate.setCountry(addressDetails.getCountry());
            addressRepository.save(addressToUpdate);
            return userRepository.save(user);
        } else {
            throw new Exception("Address not found or does not belong to this user");
        }
    }

    @Override
    public List<User> findAllUsers() throws Exception {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_CUSTOMER)
                .toList();
    }

    @Override
    public void deleteUserById(Long id) throws Exception {
        User user = userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
        if (user.getRole() != com.anh.model.USER_ROLE.ROLE_CUSTOMER) {
            throw new Exception("Chỉ có thể xóa tài khoản Khách Hàng (Customer).");
        }
        
        // 1. Delete reviews written by this user
        List<Review> userReviews = reviewRepository.findByCustomerId(id);
        if (!userReviews.isEmpty()) {
            reviewRepository.deleteAll(userReviews);
        }

        // 2. Delete cart associated with this user
        Cart cart = cartRepository.findByCustomerId(id);
        if (cart != null) {
            cartRepository.delete(cart);
        }

        // 4. Delete user (JPA will cascade delete address/orders due to cascade=CascadeType.ALL in User.java)
        userRepository.delete(user);
    }

    @Override
    public User updateUserProfile(String jwt, User userDetails) throws Exception {
        User user = findUserByJwtToken(jwt);
        if (userDetails.getFullName() != null && !userDetails.getFullName().trim().isEmpty()) {
            user.setFullName(userDetails.getFullName().trim());
        }
        if (userDetails.getAvatar() != null) {
            user.setAvatar(userDetails.getAvatar().trim());
        }
        return userRepository.save(user);
    }
}