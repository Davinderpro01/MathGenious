import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  getPerfilData(token: string): Observable<any> {
    const headers = { Authorization: token };
    return this.http.get<any>(`${this.baseUrl}perfil`, { headers });
  }

  //fuciones para CRUD de cursos

  getModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/modules`);
  }

  createModule(moduleData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/modules`, moduleData);
  }

  updateModule(moduleId: string, moduleData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}api/modules/${moduleId}`, moduleData);
  }

  deleteModule(moduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}api/modules/${moduleId}`);
  }

  //funciones para CRUD de temas

  // Obtener la lista de submódulos de un módulo por su ID
  getSubmodules(moduleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/modules/${moduleId}/submodules`);
  }

  // Crear un nuevo submódulo asociado a un módulo
  createSubmodule(moduleId: string, submoduleData: any): Observable<any> {
    // Asegúrate de incluir el ID del módulo seleccionado en los datos del submódulo
    const dataWithModuleId = { ...submoduleData, moduleId: moduleId };

    return this.http.post(`${this.baseUrl}api/modules/${moduleId}/submodules`, dataWithModuleId);
  }

  // Obtener la lista de submódulos de un módulo por su ID
  getSubmodule(moduleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/modules/${moduleId}/submodules`);
  }

  updateSubmodule(submoduleId: string, submoduleData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}api/submodules/${submoduleId}`, submoduleData);
  }

  deleteSubmodule(submoduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}api/submodules/${submoduleId}`);
  }

  // funciones para CRUD de videos

  getVideos(submoduleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/submodules/${submoduleId}/videos`);
  }

  createVideo(submoduleId: string, videoData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/submodules/${submoduleId}/videos`, videoData);
  }

  getVideo(videoId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/videos/${videoId}`);
  }

  updateVideo(videoId: string, videoData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}api/videos/${videoId}`, videoData);
  }

  deleteVideo(videoId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}api/videos/${videoId}`);
  }
}
