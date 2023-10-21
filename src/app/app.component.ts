import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './model/usuario';
import { environment } from 'src/environments/environment';

interface Role {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  perfilData: any;
  isAdmin: boolean = false;
  private baseUrl = environment.backendUrl;

  private _items = new BehaviorSubject<Usuario[]>([]);

  set items(value: Usuario[]) {
    this._items.next(value);
  }
  get items() {
    return this._items.getValue();
  }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);

      this.http.get<any>(`${this.baseUrl}perfil`, { headers }).subscribe({
        next: (response) => {
          this.perfilData = response.user;
          this.items = response.user;

          if (this.perfilData.roles && this.perfilData.roles.some((role: Role) => role.name === 'admin')) {
            this.isAdmin = true;
          }

          if (this.router.url === '/perfil') {
            this.redirigirAInicioSesion();
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401 && error.error.message === 'Acceso no autorizado') {
            this.cerrarSesion();
          }
        }
      });
    } else {
      this.router.navigate(['']);
    }
  }

  redirigirAInicioSesion() {
    this.router.navigateByUrl('/perfil', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/perfil']).then(() => {
        this.ngOnInit();
      });
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.perfilData = null;
    this.isAdmin = false;
    this.router.navigate(['/ingreso']);
  }

  getUserID(): string | null {
    if (this.perfilData) {
      return this.perfilData._id; // Ajusta esto según la estructura de tu objeto de usuario autenticado
    }
    return null;
  }
  getNombre(): string | null {
    if (this.perfilData) {
      return this.perfilData.nombre; // Ajusta esto según la estructura de tu objeto de usuario autenticado
    }
    return null;
  }
}
