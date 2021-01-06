import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  private _uploadEmitter = new EventEmitter<any>();

  constructor() { }

  get uploadEmitter(): EventEmitter<any> {
    return this._uploadEmitter;
  }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
