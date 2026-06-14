import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private ss: SupabaseService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, ingresa datos válidos.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      // 1. Iniciar sesión
      const { data, error } = await this.ss.login(this.loginForm.value.email, this.loginForm.value.password);
      if (error) throw error;
      
      if (!data.user) throw new Error('Error al obtener la sesión.');

      // 2. Obtener perfil
      const perfil = await this.ss.getPerfil(data.user.id);
      console.log('Perfil cargado:', perfil);
      
      // 3. Redirección final
      if (perfil && perfil.rol === 'admin') {
        await this.router.navigate(['/admin']);
      } else {
        await this.router.navigate(['/dashboard-usuario']);
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      this.errorMessage = err.message || 'Error al conectar con el servidor.';
    } finally {
      this.loading = false;
    }
  }
}