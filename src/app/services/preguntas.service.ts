import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PreguntasService {
  private baseUrl = environment.backendUrl;
  constructor(private http: HttpClient) {}

  obtenerPreguntas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}preguntas`); // Ajusta la ruta según tu configuración
  }

  crearPregunta(pregunta: any): Observable<any> {
    return this.http.post(`${this.baseUrl}preguntas`, pregunta); // Ajusta la ruta según tu configuración
  }

  editarPregunta(id: string, pregunta: any): Observable<any> {
    return this.http.put(`${this.baseUrl}preguntas/${id}`, pregunta); // Ajusta la ruta según tu configuración
  }

  eliminarPregunta(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}preguntas/${id}`); // Ajusta la ruta según tu configuración
  }

}
