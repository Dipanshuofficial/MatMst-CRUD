import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent implements OnInit {
  userId: string = '';
  userEmail: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        // Decode the JWT payload (the middle segment of the token)
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload.id?.toString() || '?';
        this.userEmail = payload.email || 'User';
      } catch (e) {
        console.error('Error parsing token', e);
      }
    }
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
