package com.anh.service;

import com.anh.model.Coupon;
import com.anh.model.Restaurant;
import com.anh.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public Coupon createCoupon(Coupon coupon, Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        coupon.setRestaurant(restaurant);
        coupon.setActive(true);
        // Kiểm tra xem mã này đã tồn tại cho nhà hàng này chưa
        if (couponRepository.findByCodeAndRestaurantId(coupon.getCode(), restaurantId).isPresent()) {
            throw new Exception("Coupon code already exists for this restaurant");
        }
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon createGlobalCoupon(Coupon coupon) throws Exception {
        coupon.setRestaurant(null);
        coupon.setActive(true);
        // Kiểm tra xem mã này đã tồn tại chưa (toàn cục hoặc cho bất kì nhà hàng nào)
        if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
            throw new Exception("Coupon code already exists");
        }
        return couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Long couponId) throws Exception {
        couponRepository.deleteById(couponId);
    }

    @Override
    public List<Coupon> getRestaurantCoupons(Long restaurantId) throws Exception {
        return couponRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public Coupon findCouponByCode(String code, Long restaurantId) throws Exception {
        java.util.Optional<Coupon> opt = java.util.Optional.empty();
        if (restaurantId != null) {
            opt = couponRepository.findByCodeAndRestaurantId(code, restaurantId);
        }
        if (!opt.isPresent()) {
            // Tìm theo mã trên toàn hệ thống để lấy thông tin chi tiết nhà hàng sở hữu mã
            opt = couponRepository.findByCode(code);
        }
        return opt.orElseThrow(() -> new Exception("Mã giảm giá không tồn tại hoặc đã hết hạn"));
    }

    @Override
    public List<Coupon> getAllCoupons() throws Exception {
        return couponRepository.findAll();
    }
}
