import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API } from '../shared/api';
import { Session } from '../shared/session';

type Msg = { from: 'user'|'agent', text: string };

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">
    <div class="page-title">Ask SmartBank (Agentic AI)</div>
    <p class="muted">Ask natural language questions. The agent will call customer-service tools (dashboard, KYC) on your behalf.</p>

    <div class="chat-window">
      <div *ngFor="let m of messages" class="bubble" [ngClass]="m.from">
        <b>{{m.from==='user'?'You':'Agent'}}:</b> {{m.text}}
      </div>
    </div>

    <label>Your message</label>
    <input [(ngModel)]="input" (keydown.enter)="send()"/>

    <p class="error" *ngIf="err">{{err}}</p>
    <button style="margin-top:10px" (click)="send()">Send</button>

    <div class="card" *ngIf="lastActions?.length">
      <h3>Actions (Audit Preview)</h3>
      <div *ngFor="let a of lastActions">
        • {{a.tool}} ({{a.status}})
      </div>
    </div>

    <p class="muted" style="margin-top:10px">
      Try: <i>show my dashboard</i>, <i>kyc status</i>, <i>submit kyc pan</i>. You must be logged in so the agent can validate your token.
    </p>
  </div>
  `
})
export class AssistantComponent {
  input='';
  err='';
  lastActions:any[]=[];
  messages: Msg[] = [{from:'agent', text:'Hi! Try: "show my dashboard" or "submit kyc pan".'}];

  constructor(private http: HttpClient) {}

  send() {
    const msg = (this.input||'').trim();
    if (!msg) return;
    if (!Session.username) { this.err = 'Please register first.'; return; }

    this.messages.push({from:'user', text: msg});
    this.input='';
    this.err='';

    const headers: any = {};
    if (Session.token) headers['X-Auth-Token'] = Session.token;
    this.http.post<any>(API.ai('/api/agent/chat'), { username: Session.username, message: msg }, { headers })
      .subscribe({
        next: (res) => {
          this.lastActions = res.actions || [];
          this.messages.push({from:'agent', text: res.reply || 'OK'});
        },
        error: (e) => this.err = e?.error?.detail || 'Agent request failed'
      });
  }
}
