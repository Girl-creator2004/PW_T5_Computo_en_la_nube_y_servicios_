import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- ESTO ES LO QUE FALTABA
import { Router, RouterLink } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { SupabaseService } from '../../services/supabase.service';
import { Publicacion } from '../../interfaces/database.interface';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- AGREGADO AQUÍ
  templateUrl: './dashboard-usuario.component.html',
  styleUrls: ['./dashboard-usuario.component.css']
})
export class DashboardUsuarioComponent implements OnInit {
  idPublicacionEnEdicion = signal<number | null>(null);

  constructor(
    public pubService: PublicacionesService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Estas llamadas disparan la carga de datos desde Supabase
    this.pubService.cargarPublicacionesAceptadas();
    
    const userId = this.supabaseService.currentUser()?.id;
    if (userId) {
      this.pubService.cargarMisPublicaciones(userId);
    }
  }

  async cerrarSesion() {
    await this.supabaseService.logout();
    this.router.navigate(['/login']);
  }

  activarEdicion(pub: Publicacion) {
    this.idPublicacionEnEdicion.set(pub.id || null);
  }

  async guardarCambios(id: number, t: string, dir: string, desc: string) {
    try {
      await this.pubService.actualizarPublicacion(id, { titulo: t, direccion: dir, descripcion: desc });
      this.idPublicacionEnEdicion.set(null);
      alert('Publicación actualizada de manera exitosa.');
      const userId = this.supabaseService.currentUser()?.id;
      if (userId) this.pubService.cargarMisPublicaciones(userId);
    } catch (err) {
      alert('Error al modificar los datos.');
    }
  }

  async eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas borrar permanentemente esta publicación?')) {
      await this.pubService.eliminarPublicacion(id);
      // Recargamos los datos para que desaparezca de la vista
      this.pubService.cargarPublicacionesAceptadas();
      const userId = this.supabaseService.currentUser()?.id;
      if (userId) this.pubService.cargarMisPublicaciones(userId);
    }
  }
}