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
    <div class="page-title">Login</div>
    <p class="muted">Enter an existing username. Tokens are stored locally to authorize profile/KYC/API calls.</p>
    <label>Username</label>
    <input [(ngModel)]="username" placeholder="Registered username" />
    <div class="error" *ngIf="err">{{err}}</div>
    <div style="margin-top:12px">
      <button (click)="login()">Login</button>
    </div>
  </div>
  `
})
export class LoginComponent {
  username = '';
  err = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.err = '';
    if (!this.username) { this.err = 'Username required.'; return; }
    this.http.post(API.customer('/api/customer/login'), { username: this.username }).subscribe({
      next: (res: any) => {
        Session.username = this.username;
        Session.token = res.token;
        this.router.navigateByUrl('/dashboard');
      },
      error: () => this.err = 'Login failed.'
    });
  }
}
