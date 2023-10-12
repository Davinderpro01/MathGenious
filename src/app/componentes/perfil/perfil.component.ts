import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilData: any;
  modules: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private perfilService: PerfilService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.authService.logout(); // Cerrar la sesión si no hay un token válido
      this.router.navigate(['/']);
      return;
    }

    this.loadUserProfile(token);
  }

  loadUserProfile(token: string) {
    this.perfilService.getPerfilData(token).subscribe({
      next: (response) => {
        this.perfilData = response.user;
      },
      error: (error) => {
        if (error.status === 401 && error.error.message === 'Acceso no autorizado') {
          this.authService.logout(); // Utiliza el servicio para cerrar sesión
          this.router.navigate(['/']);
        }
      }
    });
    // Obtener la lista de módulos
    this.perfilService.getModules().subscribe({
      next: (modules) => {
        this.modules = modules;
      },
      error: (error) => {
        console.log('Error al obtener la lista de módulos:', error);
      }
    });
  }

  createModule(moduleData: any) {
    this.perfilService.createModule(moduleData).subscribe({
      next: (createdModule) => {
        this.modules.push(createdModule);
        // Redirige al componente de detalle del módulo recién creado
        this.router.navigate(['/perfil/cursos', createdModule._id]);
      },
      error: (error) => {
        console.log('Error al crear el módulo:', error);
      }
    });
  }

  updateModule(moduleId: string, moduleData: any) {
    this.perfilService.updateModule(moduleId, moduleData).subscribe({
      next: (updatedModule) => {
        const index = this.modules.findIndex(module => module._id === moduleId);
        if (index !== -1) {
          this.modules[index] = updatedModule;
        }
        // Puedes realizar cualquier lógica adicional aquí
      },
      error: (error) => {
        console.log('Error al actualizar el módulo:', error);
      }
    });
  }

  deleteModule(moduleId: string) {
    this.perfilService.deleteModule(moduleId).subscribe({
      next: () => {
        this.modules = this.modules.filter(module => module._id !== moduleId);
        // Puedes realizar cualquier lógica adicional aquí
      },
      error: (error) => {
        console.log('Error al eliminar el módulo:', error);
      }
    });
  }
}
