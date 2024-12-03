import { Routes } from '@angular/router';
import { CreatePatientComponent } from './components/create-patient/create-patient.component';
import { UpdatePatientComponent } from './components/update-patient/update-patient.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import {GetAllPatientsComponent} from './components/get-all-patients/get-all-patients.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: GetAllPatientsComponent },
  { path: 'patients/create', component: CreatePatientComponent },
  { path: 'patients/update/:id', component: UpdatePatientComponent },
  { path: 'patients/detail/:id', component: PatientDetailComponent }
];
