import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/app/models/Models';
import { PubSubService } from 'src/app/services/pub-sub.service';
import { TicketApiService } from 'src/app/services/ticket-api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  fechaInicio?: Date;
  fechaFin?: Date;

  formFiltroFecha?: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: TicketApiService,
    private pubSubService: PubSubService
  ) {
    this.crearForm();
   }

  ngOnInit(): void {
  }

  getTicketsByPeriod(): void {
    if (this.formFiltroFecha!.valid) {
      let f1 = this.formFiltroFecha!.value.fechaInicio;
      let f2 = this.formFiltroFecha!.value.fechaFin;
      this.apiService.getAllTicketsByPeriod(f1, f2)
      .subscribe({
        next: data => this.pubSubService.emitEvent<Ticket[]>('filtradoFecha', data),
        error: err => console.log(err)
      })
    }
    else alert("Fecha inicio y fecha fin son obligatorios.")
  }

  private crearForm(): void {
    this.formFiltroFecha = this.formBuilder.group({
      fechaInicio: new FormControl("", Validators.required),
      fechaFin: new FormControl("", Validators.required)
    })
  }

}
