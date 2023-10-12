import { Injectable } from '@angular/core';

interface Role {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  perfilData: any = null;
  isAdmin: boolean = false;

  setPerfilData(data: any) {
    this.perfilData = data;
    this.isAdmin = data.roles && data.roles.some((role: Role) => role.name === 'admin');
  }
}
