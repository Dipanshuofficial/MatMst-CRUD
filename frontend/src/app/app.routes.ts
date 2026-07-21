import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout';
import { MatMstComponent } from './features/mat-mst/mat-mst';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: MatMstComponent,
      },
    ],
  },
];
