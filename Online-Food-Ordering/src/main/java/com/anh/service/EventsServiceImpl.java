package com.anh.service;

import com.anh.model.Events;
import com.anh.model.Restaurant;
import com.anh.repository.EventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventsServiceImpl implements EventsService {

    @Autowired
    private EventsRepository eventsRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private com.anh.repository.CouponRepository couponRepository;

    @Override
    public Events createEvent(Events event, Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        Events newEvent = new Events();
        newEvent.setName(event.getName());
        newEvent.setImage(event.getImage());
        newEvent.setLocation(event.getLocation());
        newEvent.setStartedAt(event.getStartedAt());
        newEvent.setEndsAt(event.getEndsAt());
        newEvent.setRestaurant(restaurant);
        newEvent.setPromoCode(event.getPromoCode() != null ? event.getPromoCode().trim().toUpperCase() : null);
        newEvent.setDiscountType(event.getDiscountType() != null ? event.getDiscountType() : "PERCENTAGE");
        newEvent.setDiscountValue(event.getDiscountValue() != null ? event.getDiscountValue() : 0L);
        newEvent.setMinimumOrderValue(event.getMinimumOrderValue() != null ? event.getMinimumOrderValue() : 0L);
        Events savedEvent = eventsRepository.save(newEvent);

        // Tự động đồng bộ tạo Coupon cho nhà hàng nếu có mã giảm giá
        if (newEvent.getPromoCode() != null && !newEvent.getPromoCode().isEmpty()) {
            String code = newEvent.getPromoCode();
            Optional<com.anh.model.Coupon> opt = couponRepository.findByCodeAndRestaurantId(code, restaurantId);
            com.anh.model.Coupon coupon = opt.orElse(new com.anh.model.Coupon());
            coupon.setCode(code);
            coupon.setRestaurant(restaurant);
            coupon.setActive(true);
            coupon.setDiscountType(newEvent.getDiscountType());
            coupon.setDiscountValue(newEvent.getDiscountValue());
            coupon.setMinimumOrderValue(newEvent.getMinimumOrderValue());
            couponRepository.save(coupon);
        }

        return savedEvent;
    }

    @Override
    public List<Events> getRestaurantsEvents(Long restaurantId) {
        return eventsRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public void deleteEvent(Long eventId) throws Exception {
        Events event = findEventById(eventId);
        eventsRepository.delete(event);
    }

    @Override
    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    @Override
    public Events findEventById(Long id) throws Exception {
        Optional<Events> opt = eventsRepository.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Event not found with id " + id);
        }
        return opt.get();
    }

    @Override
    public Events updateEvent(Long eventId, Events event) throws Exception {
        Events existingEvent = findEventById(eventId);
        existingEvent.setName(event.getName());
        existingEvent.setImage(event.getImage());
        existingEvent.setLocation(event.getLocation());
        existingEvent.setStartedAt(event.getStartedAt());
        existingEvent.setEndsAt(event.getEndsAt());
        existingEvent.setPromoCode(event.getPromoCode() != null ? event.getPromoCode().trim().toUpperCase() : null);
        existingEvent.setDiscountType(event.getDiscountType() != null ? event.getDiscountType() : "PERCENTAGE");
        existingEvent.setDiscountValue(event.getDiscountValue() != null ? event.getDiscountValue() : 0L);
        existingEvent.setMinimumOrderValue(event.getMinimumOrderValue() != null ? event.getMinimumOrderValue() : 0L);
        Events savedEvent = eventsRepository.save(existingEvent);

        if (savedEvent.getPromoCode() != null && !savedEvent.getPromoCode().isEmpty() && savedEvent.getRestaurant() != null) {
            String code = savedEvent.getPromoCode();
            Long restId = savedEvent.getRestaurant().getId();
            Optional<com.anh.model.Coupon> opt = couponRepository.findByCodeAndRestaurantId(code, restId);
            com.anh.model.Coupon coupon = opt.orElse(new com.anh.model.Coupon());
            coupon.setCode(code);
            coupon.setRestaurant(savedEvent.getRestaurant());
            coupon.setActive(true);
            coupon.setDiscountType(savedEvent.getDiscountType());
            coupon.setDiscountValue(savedEvent.getDiscountValue());
            coupon.setMinimumOrderValue(savedEvent.getMinimumOrderValue());
            couponRepository.save(coupon);
        }

        return savedEvent;
    }
}
