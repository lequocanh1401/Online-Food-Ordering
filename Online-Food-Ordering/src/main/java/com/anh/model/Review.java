package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties({"favorites", "addresses", "orders", "password"})
    private User customer;

    @ManyToOne
    @JsonIgnoreProperties({"owner", "orders", "foods", "images"})
    private Restaurant restaurant;

    @ManyToOne
    @JsonIgnoreProperties({"restaurant", "foodCategory", "ingredients"})
    private Food food; // Nullable if the review is for the restaurant itself

    private double rating; // star values: 1.0 to 5.0
    private String comment;
    private LocalDateTime createdAt;
}
