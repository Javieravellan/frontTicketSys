import { Component, OnDestroy, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Ticket } from 'src/app/models/Models';
import { PubSubService } from 'src/app/services/pub-sub.service';
import { TicketApiService } from 'src/app/services/ticket-api.service';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements OnInit, OnDestroy {

  // datos a gestionar
  tickets?: Ticket[];
  tickets$?: Observable<Ticket[]>;

  // subscriber filtroFecha
  subsFiltroFecha: Subscription;
  valorBusqueda? = new FormControl('');

  constructor(
    private ticketService: TicketApiService, 
    private pubSubService: PubSubService) 
  {
    this.getAllTickets();
    this.updateContentTickets$(); // al iniciar por primera vez

    let tmp = this.pubSubService.getSubject<Ticket[]>('filtradoFecha')
    this.subsFiltroFecha = tmp //this.pubSubService.getSubject<Ticket[]>('filtradoFecha')
    .subscribe(data => {
      this.tickets = data
      this.updateContentTickets$() // en cada cambio que haya en los datos.
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.subsFiltroFecha.unsubscribe();
  }

  getAllTickets() {
    this.ticketService.getAllTickets()
    .subscribe({
      next: (tickets) => this.tickets = tickets,
      error: console.log
    })
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
}
