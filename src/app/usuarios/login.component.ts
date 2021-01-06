import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import {Usuario} from './usuario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = "Iniciar sesion";
  usuario: Usuario;

  constructor(private router: Router, private authService: AuthService) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      swal.fire({
        title: 'Login',
        text: `Hola ${this.authService.usuario.username} bienvenido de regreso`,
        icon: 'info'
      });
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      swal.fire({
        title: "Error login",
        text: "Username o Password vacias!",
        icon: "error"
      });
      return;
    }
    this.authService.login(this.usuario).subscribe(
      response => {
        console.log('login', response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);
        swal.fire({
          title: "Login",
          text: `Hola ${usuario.username} ha iniciado sesion con exito`,
          icon: "success"
        });
      },
      error => {
        if(error.status == 400) {
          swal.fire({
            title: "Error Login",
            text: "Usuario o clave incorrecta",
            icon: "error"
          })
        }
      }
    )
  }

}
