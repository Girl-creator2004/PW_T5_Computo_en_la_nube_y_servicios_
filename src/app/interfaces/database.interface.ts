export interface Perfil {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  telefono?: string;
  correo: string;
  rol: 'normal' | 'admin';
  creado_en?: string;
}

export interface Publicacion {
  id?: number;
  usuario_id: string;
  titulo: string;
  direccion: string;
  descripcion: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  creado_en?: string;
  // Propiedad auxiliar para renderizar sus imágenes juntas en el Front-end
  imagenes?: string[]; 
  // Propiedad opcional si queremos saber quién la publicó (unir con perfil)
  perfil?: Perfil;
}

export interface ImagenPublicacion {
  id?: number;
  publicacion_id: number;
  url_imagen: string;
}