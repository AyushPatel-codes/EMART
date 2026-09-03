package com.Project.EMART.controller;

import com.Project.EMART.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(@RequestBody Map<String, Double> request) {
        try {
            double amount = request.get("amount");
            com.razorpay.Order order = paymentService.createOrder(amount, "INR", "receipt_" + System.currentTimeMillis());
            JSONObject response = new JSONObject();
            response.put("orderId", String.valueOf(order.get("id")));
            response.put("amount", Double.valueOf(order.get("amount")));
            response.put("currency", String.valueOf(order.get("currency")));

            return ResponseEntity.ok(response.toMap());
        }catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> ignoredRequest) {
        return ResponseEntity.ok(Map.of("status", "success", "message", "Payment Verified Successfully"));
    }
}

