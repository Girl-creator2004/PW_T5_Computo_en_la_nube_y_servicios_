import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true; // Activa el estado "Cargando..."
    const { email, password } = this.loginForm.value;

    try {
      const { data, error } = await this.supabaseService.login(email, password);
      
      if (error) throw error;

      // Si no hay error, el usuario está autenticado
      if (data.user) {
        console.log("Inicio de sesión exitoso");
        this.loading = false; // Desactiva el estado de carga
        
        // REDIRECCIÓN AL DASHBOARD DEL USUARIO
        this.router.navigate(['/dashboard-usuario']); 
      }
    } catch (err: any) {
      this.loading = false; // Asegura desactivar el loading aunque falle
      alert('Error al iniciar sesión: ' + err.message);
    }
  }
}