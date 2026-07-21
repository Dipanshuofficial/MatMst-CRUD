import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private toast: MessageService,
    private router: Router,
  ) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Log In Successful!',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error.message,
        });
      },
    });
  }
  onRegister() {
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration Successful! You can now log in.',
        });
      },
      error: (err) => {
        this.toast.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: err.message,
        });
      },
    });
  }
}
