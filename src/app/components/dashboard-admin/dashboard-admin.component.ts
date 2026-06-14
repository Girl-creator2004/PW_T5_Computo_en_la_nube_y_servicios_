import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <--- IMPORTANTE
import { PublicacionesService } from '../../services/publicaciones.service';
import { SupabaseService } from '../../services/supabase.service'; // <--- IMPORTANTE

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html'
})
export class DashboardAdminComponent implements OnInit {

  constructor(
    public pubService: PublicacionesService,
    private ss: SupabaseService, // Servicio de Auth
    private router: Router
  ) {}

  ngOnInit() {
    this.pubService.cargarTodasParaAdmin();
  }

  async resolver(id: any, dictamen: 'aceptada' | 'rechazada') {
    if (confirm(`¿Deseas ${dictamen} esta publicación?`)) {
      await this.pubService.cambiarEstadoPublicacion(id, dictamen);
    }
  }

  // Nuevo método para cerrar sesión
  async cerrarSesion() {
    await this.ss.logout();
    this.router.navigate(['/login']);
  }
}