package com.learnlytica.smartbank.customer.api.dto;

public class DashboardSummaryResponse {
  public String username;
  public String fullName;
  public String kycStatus;
  public int profileCompletion;
  public String message;

  public DashboardSummaryResponse(String username, String fullName, String kycStatus, int profileCompletion, String message) {
    this.username = username;
    this.fullName = fullName;
    this.kycStatus = kycStatus;
    this.profileCompletion = profileCompletion;
    this.message = message;
  }
}
