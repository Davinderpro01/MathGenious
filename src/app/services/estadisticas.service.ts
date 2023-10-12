import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  private baseUrl = environment.backendUrl;
  constructor(private http: HttpClient) {}

  obtenerHistorialSesiones(userId: string): Observable<any> {
    const url = `${this.baseUrl}obtener-estadisticas/${userId}`;
    return this.http.get(url);
  }

  guardarSesionHistorial(userId: string, sessionData: any): Observable<any> {
    const url = `${this.baseUrl}guardar-sesion-historial`;
    return this.http.post(url, { userId, ...sessionData });
  }
}
