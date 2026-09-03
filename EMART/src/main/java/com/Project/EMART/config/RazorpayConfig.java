package com.Project.EMART.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {
    private static final String KEY_ID = "rzp_test_YOUR_KEY_ID";
    private static final String KEY_SECRET = "YOUR_KEY_SECRET";

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        return new RazorpayClient(KEY_ID, KEY_SECRET);
    }
}
