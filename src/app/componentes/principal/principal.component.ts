import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(public http: HttpClient, public router: Router) {}


  ngOnInit(): void{
    if(localStorage.getItem("token")){

      this.router.navigate(['/perfil']);

    }
  }

}
