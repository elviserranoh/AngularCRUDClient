import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Cliente } from './cliente';
import { ModalService } from './detalle/modal.service';
import {AuthService} from '../usuarios/auth.service';
import swal from 'sweetalert2';

import { ClienteService } from './cliente.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  clienteSeleccionado: Cliente;
  paginador: any;

  constructor(private clienteService: ClienteService,
              private activeRoute: ActivatedRoute,
              private modalService: ModalService,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe( params => {

      let page: number = +params.get('page');

      if(!page) {
        page = 0;
      }

      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    });

    this.modalService.uploadEmitter.subscribe(
      (cliente: Cliente) => {
        this.clientes.map(clienteOriginal => {
          if(clienteOriginal.id === cliente.id) {
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        })
      }
    )

  }

  delete(cliente: Cliente): void {

    swal.fire({
      title: 'Esta seguro?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No eliminar!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            console.log(response)
            this.clientes = this.clientes.filter(item => item !== cliente);
            swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito.`,
              'success'
            )
          }
        )
      }
    })
  }

  abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
