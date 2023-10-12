import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showEmptyFieldsError: boolean = false;
  showAuthError: boolean = false;
  perfilData: any = null;

  constructor(public authService: AuthService, public router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/perfil']);
    }
  }

  iniciarSesion() {
    if (this.email.trim() === '' || this.password.trim() === '') {
      this.showEmptyFieldsError = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Actualizar el estado de autenticación en el componente de la barra de navegación
        this.authService.isAuthenticated(); // Puede ser una función que devuelva true/false
        // Redirigir al usuario a la página de perfil
        this.router.navigate(['/perfil']);

        // Esperar 2 segundos antes de recargar la página
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            setTimeout(() => {
              // Recargar la página después de 2 segundos
              window.location.reload();
              this.usuarioService.setPerfilData(this.perfilData);
            }, 500); // 2 segundos (ajusta el tiempo según tus necesidades)
          }
        });
      },
      error: (error: any) => {
        // Manejar errores de inicio de sesión
        if (error.status === 401) {
          this.showAuthError = true;
        } else {
          this.errorMessage = 'Error en la solicitud de inicio de sesión';
        }
      }
    });
  }
}
