import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistorialIncidencia, Ticket } from 'src/app/models/Models';
import { PubSubService } from 'src/app/services/pub-sub.service';
import { TicketApiService } from 'src/app/services/ticket-api.service';
import { formatearFecha } from 'src/app/shared/formatDate';
import { AgregarIncidenciaComponent } from '../agregar-incidencia/agregar-incidencia.component';

@Component({
  selector: 'app-editar-ticket',
  templateUrl: './editar-ticket.component.html',
  styleUrls: ['./editar-ticket.component.css']
})
export class EditarTicketComponent implements OnInit {

  ticket: Ticket = new Ticket();
  formEditar?: FormGroup;
  
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private pubSub: PubSubService,
    private apiService: TicketApiService) { 
      this.initForm();
    }

  ngOnInit(): void {
  }

  sendForm() {
    if (this.formEditar?.valid) {
      if (!this.ticket.ticketId) {
        this._createATicket()
      } else {
        this._updateTicket()
      }
    } else {
      console.log("Debe completar los campos, por favor")
    }
  }

  abrirFormIncidencia(incidencia:HistorialIncidencia | null = null) {
    let ref = this.modalService.open(AgregarIncidenciaComponent)
    if (incidencia) { // es actualizar
      incidencia.fechaFormateada = formatearFecha(incidencia.fechaAtencion!) as string;
      ref.componentInstance.incidenciaActual = incidencia;
    } else console.log("Es nueva")
    ref.componentInstance.currentTicketId = this.ticket.ticketId // si es actualizar
  }

  private initForm() {
    this.formEditar = this.formBuilder.group({
      nombreSolicitante: new FormControl('', Validators.required),
      fechaIngreso: new FormControl('', Validators.required),
      asunto: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    })
  }

  private _updateTicket() {
    this.apiService.updateTicketById(this.ticket)
    .subscribe({
      next: data => {
        this.pubSub.emitEvent<Ticket>('ticket-update', data)
        this.formEditar?.reset()
        this.activeModal.close()
      },
      error: console.log
    })
  }

  private _createATicket() {
    this.ticket.personaSolicitante = this.formEditar!.value.nombreSolicitante
    this.ticket.descripcion = this.formEditar!.value.descripcion
    this.ticket.fechaIngreso = this.formEditar!.value.fechaIngreso
    this.ticket.asunto = this.formEditar!.value.asunto
    // enviar datos y emitir el evento
    this.apiService.createTicket(this.ticket)
    .subscribe({
      next: data => {
        this.pubSub.emitEvent<Ticket>("ticket-nuevo", data)
        this.formEditar?.reset()
        this.activeModal.close()
      },
      error: console.log
    })
  }
}

