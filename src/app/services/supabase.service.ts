import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseConfig } from '../app.config';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.key);
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.currentUser.set(session?.user || null);
    });
  }

  async login(email: string, pass: string) {
    console.log('SupabaseService: Iniciando login para', email);
    const result = await this.supabase.auth.signInWithPassword({ email, password: pass });
    console.log('SupabaseService: Resultado del login:', result);
    return result;
  }

  async signUp(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signUp({ 
      email, password: pass 
    });
    
    if (error) throw error;

    if (data?.user) {
      const { error: insertError } = await this.supabase.from('usuarios').insert([{ 
        id: data.user.id, 
        email: email, 
        rol: 'usuario'
      }]);
      if (insertError) console.error('Error insertando usuario:', insertError);
    }
    return data;
  }

  async getPerfil(userId: string) {
    console.log('SupabaseService: Buscando perfil para ID:', userId);
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('SupabaseService: Error en getPerfil:', error);
      throw error;
    }

    console.log('SupabaseService: Perfil encontrado:', data);
    return data || { rol: 'usuario' };
  }

  async logout() {
    await this.supabase.auth.signOut();
  }
}