package com.learnlytica.smartbank.customer.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="customers")
public class Customer {

  @Id
  private String username;

  private String fullName;
  private String email;
  private String phone;
  private LocalDate dob;
  private String addressLine1;
  private String city;
  private String state;
  private String pincode;

  @Enumerated(EnumType.STRING)
  private KycStatus kycStatus = KycStatus.NOT_SUBMITTED;

  private String kycDocType;

  public Customer() {}

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public LocalDate getDob() { return dob; }
  public void setDob(LocalDate dob) { this.dob = dob; }

  public String getAddressLine1() { return addressLine1; }
  public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }

  public String getState() { return state; }
  public void setState(String state) { this.state = state; }

  public String getPincode() { return pincode; }
  public void setPincode(String pincode) { this.pincode = pincode; }

  public KycStatus getKycStatus() { return kycStatus; }
  public void setKycStatus(KycStatus kycStatus) { this.kycStatus = kycStatus; }

  public String getKycDocType() { return kycDocType; }
  public void setKycDocType(String kycDocType) { this.kycDocType = kycDocType; }
}
