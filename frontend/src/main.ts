import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home.component';
import { RegisterComponent } from './app/pages/register.component';
import { ProfileComponent } from './app/pages/profile.component';
import { KycComponent } from './app/pages/kyc.component';
import { DashboardComponent } from './app/pages/dashboard.component';
import { AssistantComponent } from './app/pages/assistant.component';
import { LoginComponent } from './app/pages/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'kyc', component: KycComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'assistant', component: AssistantComponent },
  { path: 'login', component: LoginComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(console.error);
