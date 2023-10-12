import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { PrincipalComponent } from "./componentes/principal/principal.component";
import { IngresoComponent } from "./componentes/ingreso/ingreso.component";
import { PerfilComponent } from "./componentes/perfil/perfil.component";
import { RegistroComponent } from "./componentes/registro/registro.component";

import { PruebasComponent } from './componentes/perfil/pruebas/pruebas.component';
import { EstadisticasComponent } from './componentes/perfil/estadisticas/estadisticas.component';

import { SubmoduleComponent } from './componentes/submodule/submodule.component'
import { VideoComponent } from './componentes/video/video.component';

import { ModuleCrudComponent } from './componentes/module-crud/module-crud.component';
import { SubmoduleCrudComponent } from './componentes/submodule-crud/submodule-crud.component';
import { VideoCrudComponent } from './componentes/video-crud/video-crud.component';


const routes: Routes = [
  { path: 'perfil/pruebas', component: PruebasComponent },
  { path: 'perfil/estadisticas', component: EstadisticasComponent },
  { path: 'perfil/:moduleId/submodules', component: SubmoduleComponent },
  { path: 'submodule/:submoduleId/videos', component: VideoComponent },
  {
    path: "",
    redirectTo: "/principal",
    pathMatch: "full"
  },
  {
    path: "principal",
    component: PrincipalComponent
  },
  {
    path: "perfil",
    canActivate: [AuthGuard],
    component: PerfilComponent
  },
  {
    path: "admin/modulos",
    canActivate: [AuthGuard],
    component: ModuleCrudComponent,
  },
  {
    path: "admin/submodulos",
    canActivate: [AuthGuard],
    component: SubmoduleCrudComponent
  },
  {
    path: "admin/videos",
    canActivate: [AuthGuard],
    component: VideoCrudComponent
  },
  {
    path: "perfil/cursos",
    canActivate: [AuthGuard],
    component: PerfilComponent
  },
  {
    path: "perfil/pruebas",
    canActivate: [AuthGuard],
    component: PruebasComponent
  },
  {
    path: "perfil/estadisticas",
    canActivate: [AuthGuard],
    component: EstadisticasComponent
  },
  {
    path: "ingreso",
    component: IngresoComponent
  },
  {
    path: "registro",
    component: RegistroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
