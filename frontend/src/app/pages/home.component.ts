import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Session } from '../shared/session';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="card">
    <div class="page-title">SmartBank Experience</div>
    <p class="muted">Onboard customers, manage profiles, track KYC, and try the agentic AI co-pilot calling backend tools.</p>

    <div class="stat-grid">
      <div class="stat">
        <div class="label">Onboarding</div>
        <div class="value">Register + Login</div>
        <p class="muted">Create a profile and get a session token to use protected APIs.</p>
      </div>
      <div class="stat">
        <div class="label">Compliance</div>
        <div class="value">KYC flow</div>
        <p class="muted">Submit document metadata and check the current review status.</p>
      </div>
      <div class="stat">
        <div class="label">AI Assistant</div>
        <div class="value">SmartBank Agent</div>
        <p class="muted">Ask natural language queries; agent calls customer-service tools.</p>
      </div>
    </div>

    <div style="margin-top:18px; display:flex; gap:12px; flex-wrap:wrap;">
      <a routerLink="/register"><button>Register a customer</button></a>
      <a routerLink="/dashboard"><button class="secondary">View dashboard</button></a>
      <a routerLink="/assistant"><button class="secondary">Ask the agent</button></a>
    </div>

    <div class="muted" style="margin-top:10px" *ngIf="user">
      Signed in as <b>{{user}}</b>. Jump back to <a routerLink="/dashboard">Dashboard</a>.
    </div>
    <div class="muted" style="margin-top:10px" *ngIf="!user">
      New here? Register a username to see live data and try the AI flows.
    </div>
  </div>
  `
})
export class HomeComponent {
  get user() { return Session.username; }
}
