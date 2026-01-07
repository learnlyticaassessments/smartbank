package com.learnlytica.smartbank.customer.repo;

import com.learnlytica.smartbank.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {}
