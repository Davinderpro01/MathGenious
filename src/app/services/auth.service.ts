import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const user = { email, password };
    return this.http.post<any>(`${this.baseUrl}ingreso`, user).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserProfile() {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any>(`${this.baseUrl}perfil`, { headers });
    }
    return null;
  }
}
