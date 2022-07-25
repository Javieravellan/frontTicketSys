import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { HistorialIncidencia, Ticket } from 'src/app/models/Models';
import { PubSubService } from 'src/app/services/pub-sub.service';
import { TicketApiService } from 'src/app/services/ticket-api.service';
import { formatearFecha } from 'src/app/shared/formatDate';
import { EditarTicketComponent } from '../editar-ticket/editar-ticket.component';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements OnInit, OnDestroy {

  tickets?: Ticket[];
  tickets$?: Observable<Ticket[]>;

  // subscriber filtroFecha
  subsFiltroFecha?: Subscription;
  subsNuevoTicket: Subscription;
  subsUpdateTicket: Subscription;
  subsNuevaIncidencia: Subscription;
  valorBusqueda? = new FormControl('');

  constructor(
    private ticketService: TicketApiService, 
    private pubSubService: PubSubService,
    private modalService: NgbModal) 
  {
    this.getAllTickets();
    this.updateContentTickets$();

    this.subsFiltroFecha =  this.pubSubService.getSubject<Ticket[]>('filtradoFecha')
    .subscribe(data => {
      this.tickets = data
      this.updateContentTickets$()
    });

    this.subsNuevoTicket = this.pubSubService.getSubject<Ticket>('ticket-nuevo')//tmp2
    .subscribe(data => {
      this.tickets?.push(data);
      this.updateContentTickets$()
    })

    this.subsUpdateTicket = this.pubSubService.getSubject<Ticket>('ticket-update')
    .subscribe(data => {
      this._updateTicket(data);
      this.updateContentTickets$()
    })

    this.subsNuevaIncidencia = this.pubSubService.getSubject<HistorialIncidencia>('nueva-incidencia')
    .subscribe(data => {
      this._updateIncidencia(data)
      this.updateContentTickets$()
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.subsFiltroFecha!.unsubscribe();
      this.subsNuevoTicket!.unsubscribe();
      this.subsNuevaIncidencia!.unsubscribe();
  }

  getAllTickets() {
    this.tickets$ = this.ticketService.getAllTickets();
    this.ticketService.getAllTickets()
    .subscribe({
      next: (tickets) => this.tickets = tickets,
      error: console.log
    })
  }

  deleteTicket(id: number) {
    if (confirm("¿Estás seguro?")) {
      this.ticketService.deleteTicketById(id)
      .subscribe({
        next: data => {
          if (data) {
            this.tickets = this.tickets?.filter(ti => ti.ticketId != id);
            this.updateContentTickets$();
          }
        },
        error: err => alert(err)
      })
    }
  }

  abrirModal(ticket: Ticket | null = null): void {
    let ref = this.modalService.open(EditarTicketComponent);
    if (ticket) {
      ticket.fechaFormateada = formatearFecha(ticket.fechaIngreso!);
      ref.componentInstance.ticket = ticket;
    }
    else console.log("Crear nuevo ticket");
  }

  private search(text: string): Ticket[] {
    return this.tickets!.filter(ticket => {
      const term = text.toLowerCase();
      return ticket.personaSolicitante!.toLowerCase().includes(term)
    });
  }

  private updateContentTickets$() {
    this.tickets$ = this.valorBusqueda!.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    )
  }

  private _updateTicket(newTicket: Ticket) {
    // en lugar de buscar el elemento, lo elimino y agrego al nuevo
    this.tickets = this.tickets?.filter(t => t.ticketId !== newTicket.ticketId)
    this.tickets?.push(newTicket);
  }

  private _updateIncidencia(incidencia:HistorialIncidencia) {
    let encontrado = this.tickets?.findIndex(t => t.ticketId == incidencia.ticketId)
    if (encontrado == -1 || encontrado == undefined) return
    this.tickets![encontrado].historialIncidencia.push(incidencia);
  }
}