package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InventoryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long restaurantId;

    private Long ingredientId;

    private String ingredientName;

    // AUTO_DEPLETION (Trừ kho tự động khi tạo đơn), AUTO_RESTORE (Hoàn kho khi hủy đơn), MANUAL_IMPORT (Nhập kho thêm), MANUAL_ADJUSTMENT (Điều chỉnh thủ công)
    private String actionType; 

    private Double changeAmount; // Ví dụ: -2.0 hoặc +20.0

    private Double remainingQuantity; // Số lượng tồn sau thay đổi

    private String unit;

    private Long orderId; // ID đơn hàng (nếu do đơn hàng kích hoạt)

    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();
}
