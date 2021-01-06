import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(!this.authService.isAuthenticated()) {
        this.router.navigate(["/login"]);
        return false;
      }

      if(this.isTokenExpired()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }

      let role = next.data['role'] as string;

      if(this.authService.hasRole(role)) {
        return true;
      }

      this.router.navigate(['/clientes']);
      swal.fire({
        title: "Acceso denegado",
        text: `Hola ${this.authService.usuario.nombre} no tienes acceso a este recurso`,
        icon: "warning"
      });
      return false;
    }

    isTokenExpired(): boolean {
      let token = this.authService.token;
      let payload = this.authService.obtenerDatosToken(token);
      let now = new Date().getTime() / 1000;
      if(payload.exp < now) {
        return true;
      }
      return false;
    }

  }
