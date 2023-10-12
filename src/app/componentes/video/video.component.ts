import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  submoduleId: string = '';
  videos: any[] = [];
  selectedVideoId: string | null = null;

  constructor(
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer  // Inyecta DomSanitizer aquí
  ) { }

  ngOnInit(): void {
    this.submoduleId = this.route.snapshot.paramMap.get('submoduleId') ?? '';

    // Obtener la lista de videos para el tema
    this.perfilService.getVideos(this.submoduleId).subscribe({
      next: (videos) => {
        this.videos = videos;
      },
      error: (error) => {
        console.log('Error al obtener la lista de videos:', error);
      }
    });
  }
  showVideo(videoId: string) {
    this.selectedVideoId = videoId;
  }


  // Método para sanitizar la URL
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  createVideo(videoData: any) {
    this.perfilService.createVideo(this.submoduleId, videoData).subscribe({
      next: (createdVideo) => {
        this.videos.push(createdVideo);
      },
      error: (error) => {
        console.log('Error al crear el video:', error);
      }
    });
  }

  updateVideo(videoId: string, videoData: any) {
    this.perfilService.updateVideo(videoId, videoData).subscribe({
      next: (updatedVideo) => {
        const index = this.videos.findIndex(video => video._id === videoId);
        if (index !== -1) {
          this.videos[index] = updatedVideo;
        }
      },
      error: (error) => {
        console.log('Error al actualizar el video:', error);
      }
    });
  }

  deleteVideo(videoId: string) {
    this.perfilService.deleteVideo(videoId).subscribe({
      next: () => {
        this.videos = this.videos.filter(video => video._id !== videoId);
      },
      error: (error) => {
        console.log('Error al eliminar el video:', error);
      }
    });
  }
}
