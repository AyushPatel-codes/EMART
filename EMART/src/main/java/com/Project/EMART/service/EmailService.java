package com.Project.EMART.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendOrderConfirmation(String toEmail, String orderId, double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("E-MART <noreply@emart.com>");
        message.setTo(toEmail);
        message.setSubject("Order Confirmed - " + orderId);
        message.setText(
                "Hello E-MART User,\n\n"+
                        "Your Order #" + orderId + "has been confirmed!\n" +
                        "Total Amount : Rs."+ amount + "\n\n" +
                        "Thank You FOr Shopping with E-MART.\n\n" +
                        "BEST REGARDS !!\n\n"
        );
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("E-MART <noreply@emart.com>");
        message.setTo(toEmail);
        message.setSubject("Welcome to E-MART, " + name);
        message.setText(
                "Welcome To E-MART Online ShoppingApplication" + "!\n\n"
                        + "Your Account Has Been Created Successfully"
        );
        mailSender.send(message);
    }
}
