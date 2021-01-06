import { Component, OnInit, Input } from '@angular/core';
import {HttpEventType} from '@angular/common/http';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  title: string = "Detalle del cliente";
  imagenSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
              private modalService: ModalService,
              public authService: AuthService) { }

    ngOnInit(): void {
    }

    seleccionarFoto(event: any): void {
      this.imagenSeleccionada = event.target.files[0];
      if(this.imagenSeleccionada.type.indexOf('image') < 0) {
        swal.fire({
          title: "Error imagen seleccionada",
          text: "El archivo debe ser una imagen",
          icon: "error"
        });
        this.imagenSeleccionada = null;
      }
    }

    subirFoto(): void {
      if(!this.imagenSeleccionada) {
        swal.fire({
          title: "Error Upload",
          text: "Debe seleccionar una foto",
          icon: "error"
        })
      } else {
        this.clienteService.subirFoto(this.imagenSeleccionada, this.cliente.id)
        .subscribe(event => {
          if(event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100)
          } else if(event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.uploadEmitter.emit(this.cliente);
            this.progreso = 0;
            swal.fire({
              title: "La foto se ha subido correctamente",
              text: response.mensaje,
              icon: 'success'
            });
          }
        })
      }
    }

    cerrarModal(): void {
      this.modalService.cerrarModal();
      this.imagenSeleccionada = null;
      this.progreso = 0;
    }

    getModal(): boolean {
      return this.modalService.modal;
    }

  }
