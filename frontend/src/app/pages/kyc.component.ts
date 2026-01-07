import { Component } from '@angular/core';
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
    <div class="page-title">KYC</div>
    <p>Please register first.</p>
  </div>

  <div class="card" *ngIf="user">
    <div class="page-title">KYC Document Upload</div>
    <p class="muted">This demo simulates metadata capture; in production the file would flow to secure storage.</p>

    <label>Document Type</label>
    <select [(ngModel)]="docType">
      <option value="PAN">PAN</option>
      <option value="AADHAAR">AADHAAR</option>
      <option value="PASSPORT">PASSPORT</option>
    </select>

    <label>Select File</label>
    <input type="file" (change)="onFile($event)" />
    <p class="muted" *ngIf="fileName">Selected: {{fileName}}</p>

    <p class="error" *ngIf="err">{{err}}</p>
    <p class="badge" *ngIf="ok">{{ok}}</p>

    <div style="margin-top:12px; display:flex; gap:10px; align-items:center;">
      <button (click)="submit()">Submit KYC</button>
      <span class="muted">We’ll mark the record as PENDING_REVIEW for this demo.</span>
    </div>

    <div class="card" style="margin-top:12px" *ngIf="status">
      <h3>Current KYC Status</h3>
      <p><span class="badge">{{status.kycStatus}}</span> • Document: {{status.docType || '-' }}</p>
      <p class="muted">If you restart Docker, re-submit KYC because in-memory data resets.</p>
    </div>
  </div>
  `
})
export class KycComponent {
  get user() { return Session.username; }
  docType = 'PAN';
  fileName = '';
  err='';
  ok='';
  status:any=null;

  constructor(private http: HttpClient) {
    this.refresh();
  }

  onFile(ev:any) {
    const f = ev?.target?.files?.[0];
    this.fileName = f ? f.name : '';
  }

  refresh() {
    if (!this.user) return;
    const headers: any = {};
    if (Session.token) headers['X-Auth-Token'] = Session.token;
    this.http.get<any>(API.customer(`/api/customer/kyc/status?username=${this.user}`), { headers }).subscribe({
      next: (s) => this.status = s,
      error: (e) => {
        this.status = null;
        if (e?.status === 404) this.err = 'Customer not found. Please register or log in again.';
      }
    });
  }

  submit() {
    this.err=''; this.ok='';
    if (!this.user) return;
    const headers: any = {};
    if (Session.token) headers['X-Auth-Token'] = Session.token;
    this.http.post<any>(API.customer('/api/customer/kyc/submit'), {
      username: this.user,
      docType: this.docType
    }, { headers }).subscribe({
      next: () => { this.ok='KYC submitted successfully.'; this.refresh(); },
      error: () => this.err='Failed to submit KYC.'
    });
  }
}
