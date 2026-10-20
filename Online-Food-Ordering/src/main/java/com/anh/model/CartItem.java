package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @ManyToOne
    private Cart cart;

    @ManyToOne
    @JsonIgnoreProperties({"foodCategory", "ingredients"})
    private Food food;

    private int quantity;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> ingredients;

    private Long totalPrice;
}