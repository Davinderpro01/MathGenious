import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegistroComponent } from './componentes/registro/registro.component';
import { IngresoComponent } from './componentes/ingreso/ingreso.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';

import { PruebasComponent } from './componentes/perfil/pruebas/pruebas.component';
import { EstadisticasComponent } from './componentes/perfil/estadisticas/estadisticas.component';

import { YoutubePipe } from './pipe/youtube.pipe';
import { SubmoduleComponent } from './componentes/submodule/submodule.component';
import { VideoComponent } from './componentes/video/video.component';
import { ModuleCrudComponent } from './componentes/module-crud/module-crud.component';
import { SubmoduleCrudComponent } from './componentes/submodule-crud/submodule-crud.component';
import { VideoCrudComponent } from './componentes/video-crud/video-crud.component';


const routes: Routes = [
  { path: '', redirectTo: '/principal', pathMatch: 'full' },
  { path: 'perfil', canActivate: [AuthGuard], component: PerfilComponent },
  { path: '**', redirectTo: '/principal', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    IngresoComponent,
    PrincipalComponent,
    PerfilComponent,
    PruebasComponent,
    YoutubePipe,
    EstadisticasComponent,
    SubmoduleComponent,
    VideoComponent,
    ModuleCrudComponent,
    SubmoduleCrudComponent,
    VideoCrudComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)

  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
