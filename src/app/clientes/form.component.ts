import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import { Region } from './region';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public title: string = "Crear cliente";
  public cliente: Cliente = new Cliente();
  public regiones: Region[];
  public errors: String[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id) {
        this.clienteService.getCliente(id).subscribe(
          cliente =>  this.cliente = cliente
        );
      }
    });
    this.clienteService.getRegiones().subscribe(
      regiones => {
        console.log(regiones);
        this.regiones = regiones;
      }
    )
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal.fire({
          title: 'Nuevo cliente',
          text: ` El cliente ${cliente.nombre} ha sido creado con exito`,
          icon: 'success'
        });
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codigo del error desde el backend: ', err.status);
        console.error(err.error.errors);
      }
    );
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal.fire({
          title: 'Cliente actualizado',
          text: `${response.mensaje}: ${response.cliente.nombre}`,
          icon: 'success'
        })
      },
      err => {
        if(err.error.error?.length > 0) {
          swal.fire({
            title: err.error.mensaje,
            text: err.error.error,
            icon: "error"
          })
        } else if(err.error.errors) {
          this.errors = err.error.errors as string[];
        }
      }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
