import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { appRoutes } from './app.routes';
import { PatientService } from './services/patient.service';
import { CreatePatientComponent } from './components/create-patient/create-patient.component';
import { GetAllPatientsComponent } from './components/get-all-patients/get-all-patients.component';
import { UpdatePatientComponent } from './components/update-patient/update-patient.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatePatientComponent,
    GetAllPatientsComponent,
    UpdatePatientComponent,
    PatientDetailComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [provideHttpClient(), PatientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
