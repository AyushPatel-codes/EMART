package com.Project.EMART.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Address {
    private String id;
    @NotBlank private String fullName;
    @NotBlank private String phone;
    @NotBlank private String line1;
    private String line2;
    @NotBlank private String city;
    private String state;
    @NotBlank private String postalCode;
    @NotBlank private String country;
    private boolean defaultAddress;
}
