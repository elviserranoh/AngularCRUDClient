import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent {

  title:string = 'Angular - Spring'

  constructor(public authService: AuthService,
    private router:Router) {
    }

    ngOnInit() {
    }

    logout(): void {
      let nombre = this.authService.usuario.nombre;

      this.authService.logout();

      swal.fire({
        title: "Logout",
        text: `Hola ${nombre} ha cerrado sesion con exito`,
        icon: "success"
      });

      this.router.navigate(["/clientes"]);
    }

  }
