package com.anh.request;

import lombok.Data;

@Data
public class IngredientRequest {
    private String name;
    private Long categoryId;
    private Long restaurantId;
    private Double quantity = 50.0;
    private String unit = "phần";
    private Double minThreshold = 10.0;
}