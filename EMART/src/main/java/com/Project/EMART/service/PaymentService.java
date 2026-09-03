package com.Project.EMART.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;


import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final RazorpayClient razorpayClient;

    //Creating order on razorpay
    public Order createOrder(double amount, String currency, String receiptId) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount",amount * 100);//Razorpay accepts amount in paise
        orderRequest.put("currency",currency);
        orderRequest.put("receipt",receiptId);

        return razorpayClient.orders.create(orderRequest);
    }

    //Verify Payment
    public boolean verifySignature(Map<String, String> responseMap, String secret) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id",responseMap.get("razorpay_order_id"));
            options.put("razorpay_payment_id",responseMap.get("razorpay_payment_id"));
            options.put("razorpay_signature",responseMap.get("razorpay_signature"));

            return Utils.verifyPaymentSignature(options, secret);

        }
        catch (Exception e) {
            return false;
        }
    }
}
