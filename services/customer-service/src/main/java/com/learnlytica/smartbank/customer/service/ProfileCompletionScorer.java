package com.learnlytica.smartbank.customer.service;

import com.learnlytica.smartbank.customer.model.Customer;

public class ProfileCompletionScorer {

  // 8 fields => 100% (each 12.5%)
  public static int score(Customer c) {
    int filled = 0;
    if (notEmpty(c.getFullName())) filled++;
    if (notEmpty(c.getEmail())) filled++;
    if (notEmpty(c.getPhone())) filled++;
    if (c.getDob() != null) filled++;
    if (notEmpty(c.getAddressLine1())) filled++;
    if (notEmpty(c.getCity())) filled++;
    if (notEmpty(c.getState())) filled++;
    if (notEmpty(c.getPincode())) filled++;

    double pct = (filled / 8.0) * 100.0;
    return (int) Math.round(pct);
  }

  private static boolean notEmpty(String s) {
    return s != null && !s.trim().isEmpty();
  }
}
