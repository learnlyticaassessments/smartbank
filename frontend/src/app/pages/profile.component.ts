import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API } from '../shared/api';
import { Session } from '../shared/session';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card" *ngIf="!user">
    <div class="page-title">Profile</div>
    <p>Please register first to manage your profile.</p>
  </div>

  <div class="card" *ngIf="user">
    <div class="page-title">Profile</div>
    <p class="muted">Keep contact details current so dashboard scores stay high.</p>

    <div class="row">
      <div>
        <label>Full Name *</label>
        <input [(ngModel)]="fullName" placeholder="Full name" />
      </div>
      <div>
        <label>Email *</label>
        <input [(ngModel)]="email" placeholder="name@example.com" />
      </div>
    </div>

    <div class="row">
      <div>
        <label>Phone *</label>
        <input [(ngModel)]="phone" placeholder="10-digit phone" />
      </div>
      <div>
        <label>Date of Birth</label>
        <input [(ngModel)]="dob" placeholder="YYYY-MM-DD" />
      </div>
    </div>

    <label>Address Line 1</label>
    <input [(ngModel)]="addressLine1" placeholder="Street and number" />

    <div class="row">
      <div>
        <label>City</label>
        <input [(ngModel)]="city" placeholder="City" />
      </div>
      <div>
        <label>State</label>
        <input [(ngModel)]="state" placeholder="State" />
      </div>
      <div>
        <label>Pincode</label>
        <input [(ngModel)]="pincode" placeholder="Postal code" />
      </div>
    </div>

    <div class="row">
      <div class="error" *ngIf="submitted && !fullName">Full name required.</div>
      <div class="error" *ngIf="submitted && !validEmail()">Valid email required.</div>
      <div class="error" *ngIf="submitted && !validPhone()">Valid phone required.</div>
    </div>

    <p class="error" *ngIf="err">{{err}}</p>
    <p class="badge" *ngIf="saved">Saved</p>

    <div style="margin-top:12px">
      <button (click)="save()">Save changes</button>
    </div>
  </div>
  `
})
export class ProfileComponent implements OnInit {
  get user() { return Session.username; }

  fullName=''; email=''; phone='';
  dob=''; addressLine1=''; city=''; state=''; pincode='';
  submitted=false; err=''; saved=false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (!this.user) return;
    this.http.get<any>(API.customer(`/api/customer/profile/${this.user}`)).subscribe({
      next: (c) => {
        this.fullName = c.fullName || '';
        this.email = c.email || '';
        this.phone = c.phone || '';
        this.dob = c.dob || '';
        this.addressLine1 = c.addressLine1 || '';
        this.city = c.city || '';
        this.state = c.state || '';
        this.pincode = c.pincode || '';
      }
    });
  }

  validEmail() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email); }
  validPhone() { return /^\d{10}$/.test(this.phone); }

  save() {
    this.submitted = true;
    this.saved = false;
    this.err = '';
    if (!this.fullName || !this.validEmail() || !this.validPhone()) return;

    this.http.put(API.customer(`/api/customer/profile/${this.user}`), {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      dob: this.dob,
      addressLine1: this.addressLine1,
      city: this.city,
      state: this.state,
      pincode: this.pincode
    }).subscribe({
      next: () => this.saved = true,
      error: () => this.err = 'Failed to save profile.'
    });
  }
}
