package com.learnlytica.smartbank.customer.session;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {
  private final Map<String, String> tokenToUser = new ConcurrentHashMap<>();

  public String createSession(String username) {
    String token = UUID.randomUUID().toString();
    tokenToUser.put(token, username);
    return token;
  }

  public String getUsername(String token) {
    return tokenToUser.get(token);
  }

  public void invalidate(String token) {
    tokenToUser.remove(token);
  }
}
