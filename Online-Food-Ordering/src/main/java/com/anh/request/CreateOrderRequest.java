package com.anh.request;

import com.anh.model.Address;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private Long restaurantId;
    private Address deliveryAddress;
    private String couponCode;
    private String paymentMethod;
}