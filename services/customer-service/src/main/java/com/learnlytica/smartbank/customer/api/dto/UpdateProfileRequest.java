package com.learnlytica.smartbank.customer.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UpdateProfileRequest {
  @NotBlank
  public String fullName;

  @Email
  @NotBlank
  public String email;

  @NotBlank
  public String phone;

  public String addressLine1;
  public String city;
  public String state;
  public String pincode;
  public String dob; // yyyy-mm-dd
}
