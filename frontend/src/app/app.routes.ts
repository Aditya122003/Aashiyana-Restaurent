import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SuperAdminLoginComponent } from './pages/superadmin/superadmin-login/superadmin-login.component';
import { SuperAdminDashboardComponent } from './pages/superadmin/superadmin-dashboard/superadmin-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Ashiana | Sweets, Bakery & Restaurant Shimla' },
  { path: 'superadmin', component: SuperAdminLoginComponent, title: 'Superadmin Login | Ashiana Portal' },
  { path: 'superadmin/dashboard', component: SuperAdminDashboardComponent, canActivate: [authGuard], title: 'Superadmin Dashboard | Ashiana Portal' },
  { path: '**', redirectTo: '' }
];
