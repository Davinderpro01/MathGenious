import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-module-crud',
  templateUrl: './module-crud.component.html',
  styleUrls: ['./module-crud.component.css']
})
export class ModuleCrudComponent implements OnInit {
  moduleData: any = {
    nombre: '',
    descripcion: '',
    imagen: ''
  };
  modules: any[] = [];
  isEditMode: boolean = false;
  selectedModuleId: string | null = null;
  moduleToDelete: any = null;
  searchTerm: string = '';
  filteredModules: any[] = [];


  constructor(
    private perfilService: PerfilService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtén la lista completa de módulos
    this.perfilService.getModules().subscribe({
      next: modules => {
        this.modules = modules;
        this.filteredModules = modules; // Mostrar la lista completa inicialmente
      },
      error: error => {
        console.log('Error al obtener la lista de módulos:', error);
      }
    });
  }

  loadModules() {
    this.perfilService.getModules().subscribe({
      next: (modules) => {
        this.modules = modules;
        this.filteredModules = modules; // Mostrar la lista completa inicialmente
      },
      error: (error) => {
        console.log('Error al obtener la lista de módulos:', error);
      }
    });
  }


  createModule() {
    this.perfilService.createModule(this.moduleData).subscribe({
      next: (createdModule) => {
        this.modules.push(createdModule);
        this.resetForm();
      },
      error: (error) => {
        console.log('Error al crear el módulo:', error);
      }
    });
  }

  updateModule() {
    if (this.selectedModuleId) {
      this.perfilService.updateModule(this.selectedModuleId, this.moduleData).subscribe({
        next: (updatedModule) => {
          const index = this.modules.findIndex((module) => module._id === this.selectedModuleId);
          if (index !== -1) {
            this.modules[index] = updatedModule;
            this.resetForm();
          }
        },
        error: (error) => {
          console.log('Error al actualizar el módulo:', error);
        }
      });
    }
  }

  editModule(module: any) {
    this.selectedModuleId = module._id;
    this.moduleData = { ...module };
    this.isEditMode = true;
  }

  deleteModule(moduleId: string) {
    this.perfilService.deleteModule(moduleId).subscribe({
      next: () => {
        // Elimina el módulo de la lista local
        this.modules = this.modules.filter((module) => module._id !== moduleId);
        this.resetForm();
        // Cierra el mensaje modal
        this.cancelDelete();
        // Actualiza la lista completa de módulos desde el servidor
        this.loadModules();
      },
      error: (error) => {
        console.log('Error al eliminar el módulo:', error);
      }
    });
  }


  resetForm() {
    this.moduleData = {
      nombre: '',
      descripcion: '',
      imagen: ''
    };
    this.isEditMode = false;
    this.selectedModuleId = null;
  }


  areFieldsValid(): boolean {
    const nombreValid = !!this.moduleData.nombre;
    const descripcionValid = !!this.moduleData.descripcion;
    const imagenValid = !!this.moduleData.imagen;

    // Aplicar clases de error si los campos están vacíos
    if (!nombreValid) {
      this.addErrorClassToField('nombre');
    } else {
      this.removeErrorClassFromField('nombre');
    }

    if (!descripcionValid) {
      this.addErrorClassToField('descripcion');
    } else {
      this.removeErrorClassFromField('descripcion');
    }

    if (!imagenValid) {
      this.addErrorClassToField('imagen');
    } else {
      this.removeErrorClassFromField('imagen');
    }

    return nombreValid && descripcionValid && imagenValid;
  }

  // Función para agregar una clase de error a un campo
  addErrorClassToField(fieldName: string) {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
      fieldElement.classList.add('error');
    }
  }

  // Función para quitar una clase de error de un campo
  removeErrorClassFromField(fieldName: string) {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
      fieldElement.classList.remove('error');
    }
  }

  confirmDeleteModule(module: any) {
    this.moduleToDelete = module;
    // Aquí puedes mostrar un mensaje modal o una ventana emergente para confirmar la eliminación.
  }

  cancelDelete() {
    this.moduleToDelete = null;
  }

  filterModules() {
    if (this.searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, muestra todos los módulos
      this.filteredModules = this.modules;
    } else {
      // Filtra los módulos en función del término de búsqueda
      this.filteredModules = this.modules.filter(module =>
        module.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

}
