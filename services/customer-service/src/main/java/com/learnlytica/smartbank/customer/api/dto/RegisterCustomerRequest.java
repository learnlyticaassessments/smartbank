package com.learnlytica.smartbank.customer.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterCustomerRequest {
  @NotBlank
  public String username;

  @NotBlank
  public String fullName;

  @Email
  @NotBlank
  public String email;

  @NotBlank
  public String phone;
}
