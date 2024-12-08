import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { AuthGuard } from './services/auth.guard';
import { loginGuard } from './services/login-guard.guard';

export const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    //Comment SSO
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    //Comment SSO
    canActivate: [loginGuard],
  },
];
