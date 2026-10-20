package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
// CHẶN JACKSON ĐỤNG VÀO RESTAURANT NGAY TỪ CỬA LỚP
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "restaurant"})
public class IngredientsItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    // Chặn luôn việc category tự động lôi danh sách nguyên liệu ra gây lặp vòng
    @JsonIgnoreProperties({"ingredients", "restaurant"})
    private IngredientCategory category;

    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;

    @JsonProperty("inStoke")
    private boolean inStock = true;

    // Quản trị kho thông minh (Step 2: Smart Inventory & Depletion)
    private Double quantity = 50.0; // Số lượng tồn kho thực tế

    private String unit = "phần"; // Đơn vị tính: kg, g, phần, lít, quả, lon...

    private Double minThreshold = 10.0; // Ngưỡng an toàn cảnh báo sắp hết hàng

    @PrePersist
    @PreUpdate
    public void ensureDefaults() {
        if (quantity == null) quantity = 50.0;
        if (unit == null || unit.trim().isEmpty()) unit = "phần";
        if (minThreshold == null) minThreshold = 10.0;
        if (quantity <= 0.0) {
            inStock = false;
        }
    }

    public Double getQuantity() {
        return quantity != null ? quantity : 50.0;
    }

    public String getUnit() {
        return (unit != null && !unit.trim().isEmpty()) ? unit : "phần";
    }

    public Double getMinThreshold() {
        return minThreshold != null ? minThreshold : 10.0;
    }

    public boolean isLowStock() {
        return getQuantity() <= getMinThreshold() && getQuantity() > 0;
    }

    public boolean isOutOfStock() {
        return getQuantity() <= 0.0;
    }
}