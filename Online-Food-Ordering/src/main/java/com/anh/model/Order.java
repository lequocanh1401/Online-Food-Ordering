package com.anh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties({"favorites", "addresses", "orders"})
    private User customer;

    @ManyToOne
    @JsonIgnoreProperties({"owner", "orders", "foods", "images"})
    private Restaurant restaurant;

    private Long totalAmount;
    private String orderStatus;
    private Date createdAt;

    @ManyToOne
    private Address deliveryAddress;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    // payment logic có thể thêm sau theo video
    private int totalItem;
    private Long totalPrice;
    
    private String couponCode;
    private Long discountAmount;
    private String paymentMethod;
}