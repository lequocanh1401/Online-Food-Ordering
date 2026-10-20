package com.anh.repository;

import com.anh.model.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<InventoryLog> findTop50ByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
}
