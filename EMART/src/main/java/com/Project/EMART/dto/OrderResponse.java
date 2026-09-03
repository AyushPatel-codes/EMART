package com.Project.EMART.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private String orderId;
    private String status;
    private double totalAmount;
    private String message;
}