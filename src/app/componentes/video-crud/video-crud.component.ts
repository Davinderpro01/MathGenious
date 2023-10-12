import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-crud',
  templateUrl: './video-crud.component.html',
  styleUrls: ['./video-crud.component.css']
})
export class VideoCrudComponent implements OnInit {
  moduleId: string = '';
  submoduleId: string = '';
  videos: any[] = [];
  selectedVideoId: string | null = null;
  videoData: any = {
    title: '',
    description: '',
    url: '',
    moduleId: '', // Agregar moduleId para seleccionar el módulo
    submoduleDataId: '' // Agregar submoduleDataId para seleccionar el submódulo
  };
  confirmationVisible: boolean = false;
  videoToDeleteId: string = '';
  modules: any[] = [];
  submodules: any[] = [];
  isEditMode: boolean = false;
  searchTerm: string = '';
  filteredVideos: any[] = [];

  constructor(
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.confirmationVisible = false;
  }

  loadModules() {
    this.perfilService.getModules().subscribe({
      next: (modules) => {
        this.modules = modules;
      },
      error: (error) => {
        console.log('Error al obtener la lista de módulos:', error);
      }
    });
  }

  loadSubmodules() {
    if (!this.videoData.moduleId) {
      return;
    }

    this.perfilService.getSubmodules(this.videoData.moduleId).subscribe({
      next: (submodules) => {
        this.submodules = submodules;
        this.videoData.submoduleDataId = ''; // Reinicia el submódulo seleccionado al cambiar de módulo
        this.loadVideos();
      },
      error: (error) => {
        console.log('Error al obtener la lista de submódulos:', error);
      }
    });
  }

  loadVideos() {
    if (!this.videoData.submoduleDataId) {
      return;
    }

    this.perfilService.getVideos(this.videoData.submoduleDataId).subscribe({
      next: (videos) => {
        this.videos = videos;
        this.filteredVideos = videos; // Inicialmente, muestra todos los videos
      },
      error: (error) => {
        console.log('Error al obtener la lista de videos:', error);
      }
    });
  }

  // Función para sanitizar la URL
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Modificar createVideo para cargar la lista de videos después de crear uno
  createVideo() {
    // Verifica que se haya seleccionado un módulo y un submódulo antes de crear el video
    if (!this.videoData.moduleId || !this.videoData.submoduleDataId) {
      console.log('Por favor, selecciona un módulo y un submódulo antes de crear un video.');
      return;
    }

    this.perfilService.createVideo(this.videoData.submoduleDataId, this.videoData).subscribe({
      next: (createdVideo) => {
        // Lógica para manejar la respuesta del servicio
        this.resetForm();
        // Luego de crear un video, carga la lista de videos nuevamente
        this.loadVideos();
      },
      error: (error) => {
        console.log('Error al crear el video:', error);
      }
    });
  }


  updateVideo() {
    // Lógica para actualizar un video existente utilizando perfilService.updateVideo()
    if (this.selectedVideoId) {
      this.perfilService.updateVideo(this.selectedVideoId, this.videoData).subscribe({
        next: (updatedVideo) => {
          const index = this.videos.findIndex(video => video._id === this.selectedVideoId);
          if (index !== -1) {
            this.videos[index] = updatedVideo;
            this.resetForm();
          }
        },
        error: (error) => {
          console.log('Error al actualizar el video:', error);
        }
      });
    }
  }

  editVideo(video: any) {
    // Lógica para editar un video
    this.selectedVideoId = video._id;
    this.videoData = { ...video };
    this.isEditMode = true;
  }

  confirmDeleteVideo(videoId: string) {
    // Lógica para mostrar el mensaje modal de confirmación para eliminar un video
    this.confirmationVisible = true;
    this.videoToDeleteId = videoId;
  }


  cancelDeleteVideo() {
    // Lógica para cancelar la eliminación de un video y ocultar el mensaje modal
    this.confirmationVisible = false;
    this.videoToDeleteId = '';
  }

  deleteVideo(videoId: string) {
    this.perfilService.deleteVideo(videoId).subscribe({
      next: () => {
        // Elimina el video de la lista de videos filtrados
        this.filteredVideos = this.filteredVideos.filter(video => video._id !== videoId);

        // También elimina el video de la lista original de videos
        const videoIndex = this.videos.findIndex(video => video._id === videoId);
        if (videoIndex !== -1) {
          this.videos.splice(videoIndex, 1);
        }

        this.confirmationVisible = false;
      },
      error: (error) => {
        console.log('Error al eliminar el video:', error);
      }
    });
  }

  areFieldsValid(): boolean {
    // Realiza las validaciones necesarias aquí
    const titleValid = !!this.videoData.title;
    const descriptionValid = !!this.videoData.description;
    const urlValid = !!this.videoData.url;

    // Aplicar clases de error si los campos están vacíos
    if (!titleValid) {
      this.addErrorClassToField('title');
    } else {
      this.removeErrorClassFromField('title');
    }

    if (!descriptionValid) {
      this.addErrorClassToField('description');
    } else {
      this.removeErrorClassFromField('description');
    }

    if (!urlValid) {
      this.addErrorClassToField('url');
    } else {
      this.removeErrorClassFromField('url');
    }

    return titleValid && descriptionValid && urlValid;
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

  // Agrega este método para filtrar los videos según el término de búsqueda
  filterVideos() {
    if (!this.searchTerm) {
      // Si el término de búsqueda está vacío, muestra todos los videos del submódulo seleccionado
      this.filteredVideos = this.videos;
    } else {
      // Filtra los videos por el término de búsqueda
      this.filteredVideos = this.videos.filter((video) =>
        video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  resetForm() {
    this.videoData = {
      title: '',
      description: '',
      url: '',
      moduleId: '', // Restablece el ID del módulo seleccionado
      submoduleDataId: '' // Restablece el ID del submódulo seleccionado
    };
    this.isEditMode = false;
    this.selectedVideoId = null;
  }
}
