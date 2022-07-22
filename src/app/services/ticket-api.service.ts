import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketApiService {

  constructor(private httpClient: HttpClient) { }

  /**
   * GET all Tickets
   */
  getAllTickets() : Observable<Ticket[]> {
    return this.httpClient.get<Ticket[]>(`${environment.pathApi}`)
  }

  /**
   * GET All Tickets by range date
   */
  getAllTicketsByPeriod(f1: Date, f2: Date): Observable<Ticket[]> {
    let params = new HttpParams();
    params.set("f1", f1.toString());
    params.set('f2', f2.toString());

    return this.httpClient.get<Ticket[]>(`${environment.pathApi}/tickets/fecha?f1=${f1}&f2=${f2}`);
  } 
}
