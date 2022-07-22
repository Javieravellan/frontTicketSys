import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './views/components/top-bar/top-bar.component';
import { TablaDatosComponent } from './views/components/tabla-datos/tabla-datos.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { TicketApiService } from './services/ticket-api.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { EditarTicketComponent } from './views/components/editar-ticket/editar-ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    TablaDatosComponent,
    HomePageComponent,
    EditarTicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
