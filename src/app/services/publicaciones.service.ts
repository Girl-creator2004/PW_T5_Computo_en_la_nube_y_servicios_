import { Injectable, signal, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../app.config';
import { Publicacion } from '../interfaces/database.interface';

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private supabase: SupabaseClient;

  // Señales reactivas para los componentes
  publicacionesPublicas = signal<Publicacion[]>([]);
  misPublicaciones = signal<Publicacion[]>([]);
  todasLasPublicacionesAdmin = signal<any[]>([]);

  constructor(private ngZone: NgZone) {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.key);
  }

  // --- MÉTODOS DE USUARIO (CORREGIDOS) ---

  async cargarPublicacionesAceptadas() {
    // Eliminada la relación con perfiles para evitar el error PGRST200
    const { data, error } = await this.supabase
      .from('publicaciones')
      .select('*, imagenes_publicacion(url_imagen)')
      .eq('estado', 'aceptada')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error al cargar publicaciones aceptadas:', error);
      return;
    }

    if (data) {
      const formateadas: Publicacion[] = data.map((p: any) => ({
        ...p,
        imagenes: p.imagenes_publicacion?.map((img: any) => img.url_imagen) || []
      }));
      
      // NgZone asegura que Angular detecte el cambio y renderice la lista
      this.ngZone.run(() => {
        this.publicacionesPublicas.set(formateadas);
      });
    }
  }

  async cargarMisPublicaciones(usuarioId: string) {
    const { data, error } = await this.supabase
      .from('publicaciones')
      .select('*, imagenes_publicacion(url_imagen)')
      .eq('usuario_id', usuarioId)
      .order('creado_en', { ascending: false });

    if (data) {
      const formateadas: Publicacion[] = data.map((p: any) => ({
        ...p,
        imagenes: p.imagenes_publicacion?.map((img: any) => img.url_imagen) || []
      }));
      this.ngZone.run(() => {
        this.misPublicaciones.set(formateadas);
      });
    }
  }

  // --- MÉTODOS DE GESTIÓN (RESTAURADOS) ---

  async crearPublicacion(publicacion: Partial<Publicacion>, imagenesBase64: string[]) {
    const { data: nuevaPub, error: pubError } = await this.supabase
      .from('publicaciones')
      .insert([publicacion])
      .select()
      .single();

    if (pubError) throw pubError;

    if (imagenesBase64.length > 0 && nuevaPub) {
      const filasImagenes = imagenesBase64.map(url => ({
        publicacion_id: nuevaPub.id,
        url_imagen: url
      }));
      await this.supabase.from('imagenes_publicacion').insert(filasImagenes);
    }
    return nuevaPub;
  }

  async actualizarPublicacion(id: number, datos: Partial<Publicacion>) {
    const { data, error } = await this.supabase
      .from('publicaciones')
      .update(datos)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }

  async eliminarPublicacion(id: number) {
    await this.supabase.from('imagenes_publicacion').delete().eq('publicacion_id', id);
    const { error } = await this.supabase.from('publicaciones').delete().eq('id', id);
    if (error) throw error;
  }

  // --- MÉTODOS PARA ADMIN ---

  async cargarTodasParaAdmin() {
    const { data, error } = await this.supabase
      .from('publicaciones')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error Admin:', error);
      return;
    }
    this.ngZone.run(() => {
      this.todasLasPublicacionesAdmin.set(data || []);
    });
  }

  async cambiarEstadoPublicacion(id: number, nuevoEstado: 'aceptada' | 'rechazada') {
    if (nuevoEstado === 'rechazada') {
      await this.eliminarPublicacion(id);
    } else {
      await this.supabase.from('publicaciones').update({ estado: nuevoEstado }).eq('id', id);
    }
    await this.cargarTodasParaAdmin();
    await this.cargarPublicacionesAceptadas();
  }
}