import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API } from '../shared/api';
import { Session } from '../shared/session';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">
    <div class="page-title">Customer Registration</div>
    <p class="muted">Create a customer record with basic validations. This seeds data for profile, KYC, and the AI assistant.</p>

    <div class="row">
      <div>
        <label>Username *</label>
        <input [(ngModel)]="username" placeholder="e.g., customer1" />
        <div class="error" *ngIf="submitted && !username">Username is required.</div>
      </div>
      <div>
        <label>Full Name *</label>
        <input [(ngModel)]="fullName" placeholder="e.g., Priya Sharma" />
        <div class="error" *ngIf="submitted && !fullName">Full name is required.</div>
      </div>
    </div>

    <div class="row">
      <div>
        <label>Email *</label>
        <input [(ngModel)]="email" placeholder="name@example.com" />
        <div class="error" *ngIf="submitted && !validEmail()">Valid email is required.</div>
      </div>
      <div>
        <label>Phone *</label>
        <input [(ngModel)]="phone" placeholder="10-digit mobile number" />
        <div class="error" *ngIf="submitted && !validPhone()">Valid phone is required.</div>
      </div>
    </div>

    <div class="muted">We use simple in-memory storage; re-register after restarting Docker to seed demo data.</div>
    <p class="error" *ngIf="err">{{err}}</p>

    <div style="margin-top:14px; display:flex; gap:10px; align-items:center;">
      <button (click)="submit()">Create profile</button>
      <span class="muted">You’ll be redirected to the dashboard on success.</span>
    </div>
  </div>
  `
})
export class RegisterComponent {
  username = '';
  fullName = '';
  email = '';
  phone = '';
  submitted = false;
  err = '';

  constructor(private http: HttpClient, private router: Router) {}

  validEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
  validPhone() {
    return /^\d{10}$/.test(this.phone);
  }

  submit() {
    this.submitted = true;
    this.err = '';

    if (!this.username || !this.fullName || !this.validEmail() || !this.validPhone()) return;

    this.http.post(API.customer('/api/customer/register'), {
      username: this.username,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone
    }).subscribe({
      next: () => {
        Session.username = this.username;
        // Auto-login to obtain token for protected flows (profile/KYC/AI assistant)
        this.http.post<any>(API.customer('/api/customer/login'), { username: this.username }).subscribe({
          next: (res) => {
            Session.token = res.token;
            this.router.navigateByUrl('/dashboard');
          },
          error: () => this.router.navigateByUrl('/dashboard')
        });
      },
      error: () => this.err = 'Registration failed (username may already exist).'
    });
  }
}
