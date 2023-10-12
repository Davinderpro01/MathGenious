import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-submodule',
  templateUrl: './submodule.component.html',
  styleUrls: ['./submodule.component.css']
})
export class SubmoduleComponent implements OnInit {
  moduleId: string = '';
  submodules: any[] = [];

  constructor(
    private perfilService: PerfilService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') ?? '';

    // Obtener la lista de temas para el módulo
    this.perfilService.getSubmodules(this.moduleId).subscribe({
      next: (submodules) => {
        this.submodules = submodules;
      },
      error: (error) => {
        console.log('Error al obtener la lista de temas:', error);
      }
    });
  }

  createSubmodule(submoduleData: any) {
    this.perfilService.createSubmodule(this.moduleId, submoduleData).subscribe({
      next: (createdSubmodule) => {
        this.submodules.push(createdSubmodule);
      },
      error: (error) => {
        console.log('Error al crear el tema:', error);
      }
    });
  }

  updateSubmodule(submoduleId: string, submoduleData: any) {
    this.perfilService.updateSubmodule(submoduleId, submoduleData).subscribe({
      next: (updatedSubmodule) => {
        const index = this.submodules.findIndex(submodule => submodule._id === submoduleId);
        if (index !== -1) {
          this.submodules[index] = updatedSubmodule;
        }
      },
      error: (error) => {
        console.log('Error al actualizar el tema:', error);
      }
    });
  }

  deleteSubmodule(submoduleId: string) {
    this.perfilService.deleteSubmodule(submoduleId).subscribe({
      next: () => {
        this.submodules = this.submodules.filter(submodule => submodule._id !== submoduleId);
      },
      error: (error) => {
        console.log('Error al eliminar el tema:', error);
      }
    });
  }
}
