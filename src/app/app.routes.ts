import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { DashboardUsuarioComponent } from './components/dashboard-usuario/dashboard-usuario.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { NuevaPublicacionComponent } from './components/nueva-publicacion/nueva-publicacion.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  
  // Rutas de usuario
  { path: 'dashboard-usuario', component: DashboardUsuarioComponent },
  { path: 'dashboard', component: DashboardUsuarioComponent },
  
  // Ruta de administrador - COINCIDE CON LOGIN.TS
  { path: 'admin', component: DashboardAdminComponent },
  
  { path: 'nueva-publicacion', component: NuevaPublicacionComponent },
  { path: '**', redirectTo: 'login' } 
];