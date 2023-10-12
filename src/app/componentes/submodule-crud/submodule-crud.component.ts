import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmoduleService } from 'src/app/services/submodule.service';
import { PerfilService } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-submodule-crud',
  templateUrl: './submodule-crud.component.html',
  styleUrls: ['./submodule-crud.component.css']
})
export class SubmoduleCrudComponent implements OnInit {
  submoduleData: any = {
    nombre: '',
    descripcion: ''
  };
  submodules: any[] = [];
  isEditMode: boolean = false;
  selectedModuleId: string = ''; // Propiedad para almacenar el ID del módulo seleccionado
  modules: any[] = []; // Propiedad para almacenar la lista de módulos disponibles
  searchTerm: string = ''; // Agrega esta propiedad para el término de búsqueda
  filteredSubmodules: any[] = []; // Agrega esta propiedad para los submódulos filtrados
  confirmationVisible: boolean = false;
  submoduleToDeleteId: string = '';

  constructor(
    private submoduleService: SubmoduleService,
    private route: ActivatedRoute,
    private router: Router,
    private perfilService: PerfilService
  ) { }

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules() {
    // Obtener la lista de módulos disponibles
    this.perfilService.getModules().subscribe({
      next: (modules) => {
        this.modules = modules;
      },
      error: (error) => {
        console.log('Error al obtener la lista de módulos:', error);
      }
    });
  }

  // Método para cargar la lista de submódulos según el módulo seleccionado
  loadSubmodules() {
    if (!this.selectedModuleId) {
      // Si no se ha seleccionado un módulo, no hagas nada
      return;
    }

    // Obtener la lista de submódulos para el módulo actual
    this.perfilService.getSubmodules(this.selectedModuleId).subscribe({
      next: (submodules) => {
        this.submodules = submodules;
        // Al cargar los submódulos, también filtra de acuerdo al término de búsqueda
        this.filterSubmodules();
      },
      error: (error) => {
        console.log('Error al obtener la lista de submódulos:', error);
      }
    });
  }

  filterSubmodules() {
    if (this.searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, muestra todos los submódulos
      this.filteredSubmodules = this.submodules;
    } else {
      // Filtra los submódulos en función del término de búsqueda
      this.filteredSubmodules = this.submodules.filter(submodule =>
        submodule.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  confirmDeleteSubmodule(submoduleId: string) {
    this.confirmationVisible = true;
    // También puedes guardar el ID del submódulo que se va a eliminar
    this.submoduleToDeleteId = submoduleId;
  }

  cancelDeleteSubmodule() {
    this.confirmationVisible = false;
    this.submoduleToDeleteId = '';
  }

  areFieldsValid(): boolean {
    // Realiza las validaciones necesarias aquí
    if (!this.selectedModuleId || !this.submoduleData.nombre || !this.submoduleData.descripcion) {
      return false;
    }
    return true;
  }

  createSubmodule() {
    if (!this.selectedModuleId) {
      console.log('Por favor, selecciona un módulo antes de crear un submódulo.');
      return;
    }

    // Prepara los datos del submódulo incluyendo el ID del módulo seleccionado
    const submoduleData = {
      nombre: this.submoduleData.nombre,
      descripcion: this.submoduleData.descripcion,
      moduleId: this.selectedModuleId // Agrega el ID del módulo seleccionado
    };

    // Asegúrate de incluir ambos argumentos: moduleId y submoduleData
    this.perfilService.createSubmodule(this.selectedModuleId, submoduleData).subscribe({
      next: (createdSubmodule) => {
        this.submodules.push(createdSubmodule);
        // Limpia los campos después de crear el submódulo
        this.submoduleData.nombre = '';
        this.submoduleData.descripcion = '';
      },
      error: (error) => {
        console.log('Error al crear el submódulo:', error);
      }
    });
  }

  editSubmodule(submodule: any) {
    this.isEditMode = true;
    this.submoduleData = { ...submodule }; // Copiar los datos del submódulo al formulario
  }

  updateSubmodule() {
    if (this.submoduleData._id) {
      this.submoduleService.updateSubmodule(this.submoduleData._id, this.submoduleData).subscribe({
        next: (updatedSubmodule) => {
          const index = this.submodules.findIndex(submodule => submodule._id === this.submoduleData._id);
          if (index !== -1) {
            this.submodules[index] = updatedSubmodule;
            this.submoduleData = { nombre: '', descripcion: '' }; // Limpiar el formulario
            this.isEditMode = false;
          }
        },
        error: (error) => {
          console.log('Error al actualizar el submódulo:', error);
        }
      });
    } else {
      console.log('No se puede actualizar: el _id del submódulo no está definido.');
    }
  }

  deleteSubmodule(submoduleId: string) {
    this.submoduleService.deleteSubmodule(submoduleId).subscribe({
      next: () => {
        // Filtra los submódulos excluyendo el submódulo eliminado
        this.submodules = this.submodules.filter(submodule => submodule._id !== submoduleId);
        this.loadSubmodules();
        this.confirmationVisible = false; // Cierra el mensaje modal de confirmación
      },
      error: (error) => {
        console.log('Error al eliminar el submódulo:', error);
      }
    });
  }


}

