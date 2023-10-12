import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmoduleService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  // Obtener detalles de un submódulo por su enlace
  getSubmoduleByEnlace(enlace: string): Observable<any> {
    return this.http.get(`${this.baseUrl}api/submodules/${enlace}`);
  }

  // Crear un nuevo submódulo asociado a un módulo
  createSubmodule(moduleId: string, submoduleData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/modules/${moduleId}/submodules`, submoduleData);
  }

  // Actualizar los detalles de un submódulo
  updateSubmodule(submoduleId: string, submoduleData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}api/submodules/${submoduleId}`, submoduleData);
  }

  // Eliminar un submódulo por su ID
  deleteSubmodule(submoduleId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/submodules/${submoduleId}`);
  }

  // Agrega este método para obtener submódulos
  getSubmodules(moduleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/modules/${moduleId}/submodules`);
  }
}
