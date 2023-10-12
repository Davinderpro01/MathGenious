import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  nombre: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  validar: string = '';
  successMessage: string = '';

  constructor(public http: HttpClient, public router: Router) {}

  ngOnInit(): void{
    if(localStorage.getItem("token")){

      this.router.navigate(['/perfil']);

    }
  }

  registrarUsuario(): void {
    if (this.validarCampos()) {
      const url = environment.backendUrl+'registro';

      const usuario = { nombre: this.nombre, email: this.email, password: this.password };

      this.http.post(url, usuario).subscribe(
        {
          next: (response: any) => {
            this.successMessage = 'Usuario registrado exitosamente.';

          },
          error: (error: any) => {
            console.error('Error en el registro:', error);
            this.errorMessage = error.error.message;
          }
        }
      );
    }
  }

  nombreValido(): boolean {
    this.validar = 'Este campo es obligatorio';
    return !!this.nombre; // Verifica si el campo "nombre" no está vacío
  }

  emailValido(): boolean {
    this.validar = 'Este campo es obligatorio';
    return !!this.email; // Verifica si el campo "email" no está vacío
  }
  passwordValido(): boolean {
    this.validar = 'Este campo es obligatorio';
    return !!this.password; // Verifica si el campo "email" no está vacío
  }

  validarCampos(): boolean {
    if (!this.nombre || !this.email || !this.password) {
      this.errorMessage = 'Todos los campos son requeridos.';
      return false;
    }

    return true;
  }
}
