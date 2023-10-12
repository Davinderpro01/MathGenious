import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private baseUrl = environment.backendUrl;

  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.verifyToken(token);
    } else {
      this.router.navigate(['/']);
      return of(false);
    }
  }

  verifyToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<any>(`${this.baseUrl}perfil`, { headers }).pipe(
      map(response => {
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === 'Acceso no autorizado') {
          this.router.navigate(['/']);
        }
        return of(false);
      })
    );
  }
}
