import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { Session } from './shared/session';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">SB</div>
        <div>
          <div class="brand-name">SmartBank</div>
          <div class="brand-sub">Customer & KYC demo</div>
        </div>
      </div>
      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/register" routerLinkActive="active">Register</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <a routerLink="/kyc" routerLinkActive="active">KYC</a>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/assistant" routerLinkActive="active">Ask AI</a>
      </nav>
      <div class="user-meta" *ngIf="user; else guest">
        <span class="pill">Signed in as {{user}}</span>
        <button class="ghost" (click)="logout()">Logout</button>
      </div>
      <ng-template #guest>
        <div class="user-meta">
          <a routerLink="/login" class="ghost">Login</a>
        </div>
      </ng-template>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
export class AppComponent {
  constructor(private router: Router) {}
  get user() { return Session.username; }
  async logout() {
    await Session.logout();
    try { alert('You have been logged out.'); } catch (_) {}
    this.router.navigateByUrl('/login');
  }
}
