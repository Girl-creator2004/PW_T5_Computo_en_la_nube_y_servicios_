import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-nueva-publicacion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './nueva-publicacion.component.html',
  styleUrls: ['./nueva-publicacion.component.css']
})
export class NuevaPublicacionComponent {
  pubForm: FormGroup;
  imagenesCargadas = signal<string[]>([]);
  mostrarModalConfirmacion = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private pubService: PublicacionesService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.pubForm = this.fb.group({
      titulo: ['', Validators.required],
      direccion: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesCargadas.update(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  intentarPublicar() {
    if (this.pubForm.invalid) {
      alert('Por favor, llena todos los campos.');
      return;
    }
    this.mostrarModalConfirmacion.set(true);
  }

  async confirmarYSubir() {
    this.mostrarModalConfirmacion.set(false);
    
    const userId = this.supabaseService.currentUser()?.id;

    if (!userId) {
      alert('Error: Sesión no válida.');
      return;
    }

    // Payload ajustado exactamente a tus columnas: usuario_id, titulo, direccion, descripcion, estado
    const payload = {
      usuario_id: userId, 
      titulo: this.pubForm.value.titulo,
      direccion: this.pubForm.value.direccion,
      descripcion: this.pubForm.value.descripcion,
      estado: 'pendiente' as 'pendiente' | 'aceptada' | 'rechazada'
    };

    try {
      await this.pubService.crearPublicacion(payload, this.imagenesCargadas());
      alert('¡Publicación enviada exitosamente!');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error('Error al guardar:', err);
      alert('Error al guardar la publicación: ' + (err.message || 'Error desconocido'));
    }
  }
}