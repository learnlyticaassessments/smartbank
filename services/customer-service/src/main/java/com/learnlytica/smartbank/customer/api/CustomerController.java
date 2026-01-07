package com.learnlytica.smartbank.customer.api;

import com.learnlytica.smartbank.customer.api.dto.*;
import com.learnlytica.smartbank.customer.model.Customer;
import com.learnlytica.smartbank.customer.model.KycStatus;
import com.learnlytica.smartbank.customer.repo.CustomerRepository;
import com.learnlytica.smartbank.customer.service.ProfileCompletionScorer;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import com.learnlytica.smartbank.customer.session.SessionManager;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

  private final CustomerRepository repo;
  private final SessionManager sessions;

  public CustomerController(CustomerRepository repo, SessionManager sessions) {
    this.repo = repo;
    this.sessions = sessions;
  }

  @PostMapping("/register")
  public ResponseEntity<Customer> register(@Valid @RequestBody RegisterCustomerRequest req) {
    if (repo.existsById(req.username)) {
      return ResponseEntity.badRequest().build();
    }
    Customer c = new Customer();
    c.setUsername(req.username);
    c.setFullName(req.fullName);
    c.setEmail(req.email);
    c.setPhone(req.phone);
    c.setKycStatus(KycStatus.NOT_SUBMITTED);
    return ResponseEntity.ok(repo.save(c));
  }

  @GetMapping("/profile/{username}")
  public ResponseEntity<Customer> getProfile(@PathVariable String username, @RequestHeader(name = "X-Auth-Token", required = false) String token) {
    String effective = (token != null && sessions.getUsername(token) != null) ? sessions.getUsername(token) : username;
    return repo.findById(effective).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/profile/{username}")
  public ResponseEntity<Customer> updateProfile(@PathVariable String username, @Valid @RequestBody UpdateProfileRequest req, @RequestHeader(name = "X-Auth-Token", required = false) String token) {
    String effective = (token != null && sessions.getUsername(token) != null) ? sessions.getUsername(token) : username;
    Optional<Customer> opt = repo.findById(effective);
    if (opt.isEmpty()) return ResponseEntity.notFound().build();
    // enforce that a token must match the username for updates
    if (token == null || !effective.equals(sessions.getUsername(token))) return ResponseEntity.status(401).build();

    Customer c = opt.get();
    c.setFullName(req.fullName);
    c.setEmail(req.email);
    c.setPhone(req.phone);
    c.setAddressLine1(req.addressLine1);
    c.setCity(req.city);
    c.setState(req.state);
    c.setPincode(req.pincode);

    if (req.dob != null && !req.dob.isBlank()) {
      c.setDob(LocalDate.parse(req.dob));
    }
    return ResponseEntity.ok(repo.save(c));
  }

  @PostMapping("/kyc/submit")
  public ResponseEntity<?> submitKyc(@Valid @RequestBody KycSubmitRequest req, @RequestHeader(name = "X-Auth-Token", required = false) String token) {
    String effective = (token != null && sessions.getUsername(token) != null) ? sessions.getUsername(token) : req.username;
    Optional<Customer> opt = repo.findById(effective);
    if (opt.isEmpty()) return ResponseEntity.notFound().build();
    // require authentication for KYC submission
    if (token == null || !effective.equals(sessions.getUsername(token))) return ResponseEntity.status(401).build();

    Customer c = opt.get();
    c.setKycStatus(KycStatus.PENDING_REVIEW);
    c.setKycDocType(req.docType);
    repo.save(c);
    return ResponseEntity.ok().body(java.util.Map.of("username", c.getUsername(), "kycStatus", c.getKycStatus().name(), "docType", c.getKycDocType()));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String,String>> login(@RequestBody Map<String,String> body) {
    String username = body.get("username");
    if (username == null || username.isBlank()) return ResponseEntity.badRequest().build();
    if (!repo.existsById(username)) return ResponseEntity.status(404).build();
    String token = sessions.createSession(username);
    Map<String,String> resp = new HashMap<>();
    resp.put("token", token);
    resp.put("username", username);
    return ResponseEntity.ok(resp);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@RequestHeader(name = "X-Auth-Token", required = false) String token) {
    if (token != null) sessions.invalidate(token);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/whoami")
  public ResponseEntity<Map<String,String>> whoami(@RequestHeader(name = "X-Auth-Token", required = false) String token) {
    String username = token == null ? null : sessions.getUsername(token);
    if (username == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(Map.of("username", username));
  }

  @GetMapping("/kyc/status")
  public ResponseEntity<?> kycStatus(@RequestParam(required = false) String username, @RequestHeader(name = "X-Auth-Token", required = false) String token) {
    String effective = (token != null && sessions.getUsername(token) != null) ? sessions.getUsername(token) : username;
    if (effective == null) return ResponseEntity.badRequest().build();
    // if token present ensure it matches the requested username
    if (token != null && sessions.getUsername(token) != null && !sessions.getUsername(token).equals(effective)) return ResponseEntity.status(401).build();
    return repo.findById(effective)
      .map(c -> {
        // Map.of does not allow nulls; use a mutable map to safely include nullable docType
        Map<String,Object> resp = new HashMap<>();
        resp.put("username", c.getUsername());
        resp.put("kycStatus", c.getKycStatus().name());
        resp.put("docType", c.getKycDocType());
        return ResponseEntity.ok(resp);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/dashboard/summary")
  public ResponseEntity<DashboardSummaryResponse> dashboard(@RequestParam(required = false) String username, @RequestHeader(name = "X-Auth-Token", required = false) String token) {
    String effective = (token != null && sessions.getUsername(token) != null) ? sessions.getUsername(token) : username;
    if (effective == null) {
      return ResponseEntity.ok(new DashboardSummaryResponse(null, null, "NOT_REGISTERED", 0, "Customer not registered yet. Please register first."));
    }
    // if token present ensure it matches the requested username
    if (token != null && sessions.getUsername(token) != null && !sessions.getUsername(token).equals(effective)) return ResponseEntity.status(401).build();
    Optional<Customer> opt = repo.findById(effective);
    if (opt.isEmpty()) {
      return ResponseEntity.ok(new DashboardSummaryResponse(effective, null, "NOT_REGISTERED", 0, "Customer not registered yet. Please register first."));
    }
    Customer c = opt.get();
    int score = ProfileCompletionScorer.score(c);
    String msg = score < 75 ? "Complete your profile to unlock more banking features." : "Profile looks good.";
    return ResponseEntity.ok(new DashboardSummaryResponse(c.getUsername(), c.getFullName(), c.getKycStatus().name(), score, msg));
  }
}
