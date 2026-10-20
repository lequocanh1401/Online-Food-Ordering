package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties({"restaurant", "foodCategory", "ingredients"})
    private Food food;

    private int quantity;
    private Long totalPrice;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> ingredients;
}