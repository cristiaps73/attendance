import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'event-groups', loadComponent: () => import('./pages/event-group/event-group.component').then(m => m.EventGroupComponent), canActivate: [AuthGuard] },
  { path: 'event-groups/:id/edit', loadComponent: () => import('./pages/event-group/event-group.component').then(m => m.EventGroupComponent), canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
