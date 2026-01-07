package com.learnlytica.smartbank.customer.api.dto;

import jakarta.validation.constraints.NotBlank;

public class KycSubmitRequest {
  @NotBlank
  public String username;

  @NotBlank
  public String docType; // PAN/AADHAAR/PASSPORT
}
