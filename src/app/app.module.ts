import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { DetailsComponent } from './components/details/details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { CepPipe } from './pipes/cep.pipe';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PersonListComponent,
    DetailsComponent,
    ContactModalComponent,
    CepPipe
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, SweetAlert2Module],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
