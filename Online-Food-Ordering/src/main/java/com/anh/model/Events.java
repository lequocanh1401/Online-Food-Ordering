package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Events {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String image;
    private String startedAt;
    private String endsAt;
    private String name;
    private String location;

    private String promoCode;
    private String discountType = "PERCENTAGE"; // "PERCENTAGE" or "FLAT"
    private Long discountValue = 0L;
    private Long minimumOrderValue = 0L;

    @ManyToOne
    @JsonIgnoreProperties({"owner", "orders", "foods", "images"})
    private Restaurant restaurant;
}
