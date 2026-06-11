import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html'
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private ss: SupabaseService, private router: Router) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onRegistro() {
    if (this.registroForm.invalid) {
      alert('Por favor, revisa tus datos.');
      return;
    }

    try {
      await this.ss.signUp(this.registroForm.value.email, this.registroForm.value.password);
      alert('Registro exitoso, ahora inicia sesión');
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert('Error al registrar: ' + err.message);
    }
  }
}