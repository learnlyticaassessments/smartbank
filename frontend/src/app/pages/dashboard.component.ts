import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API } from '../shared/api';
import { Session } from '../shared/session';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="card">
    <div class="page-title">Customer Dashboard</div>
    <p class="muted">See live data from customer-service: KYC status, profile health, and helper guidance.</p>

    <div *ngIf="!user">
      <p>Please register first.</p>
    </div>

    <div *ngIf="user && data">
      <div class="row">
        <div class="stat">
          <div class="label">User</div>
          <div class="value">{{data.username}}</div>
          <p class="muted">{{data.fullName || 'Name not provided yet'}}</p>
        </div>
        <div class="stat">
          <div class="label">KYC status</div>
          <div class="value"><span class="badge">{{data.kycStatus}}</span></div>
          <p class="muted">Move to SUBMITTED/APPROVED to unlock services.</p>
        </div>
        <div class="stat">
          <div class="label">Profile completion</div>
          <div class="value">{{data.profileCompletion}}%</div>
          <div class="progress"><div class="bar" [style.width]="data.profileCompletion + '%'"></div></div>
          <p class="muted">{{data.message}}</p>
        </div>
      </div>
    </div>

    <p class="error" *ngIf="err">{{err}}</p>
    <div style="margin-top:12px">
      <button (click)="load()">Refresh data</button>
    </div>
  </div>
  `
})
export class DashboardComponent implements OnInit {
  get user() { return Session.username; }
  data:any=null;
  err='';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.err='';
    if (!this.user) return;
    this.http.get<any>(API.customer(`/api/customer/dashboard/summary?username=${this.user}`)).subscribe({
      next: (d) => this.data = d,
      error: () => this.err = 'Failed to load dashboard.'
    });
  }
}
