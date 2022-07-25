import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HistorialIncidencia } from 'src/app/models/Models';
import { PubSubService } from 'src/app/services/pub-sub.service';
import { formatearFecha } from 'src/app/shared/formatDate';

@Component({
  selector: 'app-agregar-incidencia',
  templateUrl: './agregar-incidencia.component.html',
  styleUrls: ['./agregar-incidencia.component.css']
})
export class AgregarIncidenciaComponent implements OnInit {

  formIncidencia?: FormGroup;
  currentTicketId?: number;
  incidenciaActual: HistorialIncidencia = new HistorialIncidencia();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private pubSub: PubSubService
  ) {
    this.initForm()
  }

  ngOnInit(): void {
  }

  sendFormIncidencia() {
    if (this.formIncidencia!.valid) {
      let incidencia = new HistorialIncidencia()
      incidencia.comentario = this.formIncidencia?.value.comentario
      incidencia.fechaAtencion = this.formIncidencia?.value.fechaAtencion
      incidencia.usuarioSoporte = this.formIncidencia?.value.usuarioSoporte
      incidencia.ticketId = this.currentTicketId
      incidencia.fechaFormateada = formatearFecha(incidencia.fechaAtencion!) as string
      this.pubSub.emitEvent<HistorialIncidencia>('nueva-incidencia', incidencia)
      this.activeModal.close()
    } else {
      console.log("Todos los campos son obligatorios")
    }
  }

  private initForm() {
    this.formIncidencia = this.formBuilder.group({
      usuarioSoporte: new FormControl('', Validators.required),
      fechaAtencion: new FormControl('', Validators.required),
      comentario: new FormControl('', Validators.required),
    })
  }
}
