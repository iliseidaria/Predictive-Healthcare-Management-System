import { Routes } from '@angular/router';
import { TestPageComponent } from './components/home/test-page/test-page.component';
import { PatientCreateComponent } from './components/individual-objects-pages/patient-functions-pages/patient-create/patient-create.component';
import { PatientGetAllComponent } from './components/individual-objects-pages/patient-functions-pages/patient-get-all/patient-get-all.component';
import { PatientUpdateComponent } from './components/individual-objects-pages/patient-functions-pages/patient-update/patient-update.component';
import { PatientDetailComponent } from './components/individual-objects-pages/patient-functions-pages/patient-detail/patient-detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './services/guards/auth.guard';
import { NonAuthGuard } from './services/guards/non-auth.guard';
import { AppointmentCreateComponent } from './components/individual-objects-pages/appointment-functions-pages/appointment-create/appointment-create.component';
import { AppointmentGetAllComponent } from './components/individual-objects-pages/appointment-functions-pages/appointment-get-all/appointment-get-all.component';
import { AppointmentDetailComponent } from './components/individual-objects-pages/appointment-functions-pages/appointment-detail/appointment-detail.component';
import { AppointmentUpdateComponent } from './components/individual-objects-pages/appointment-functions-pages/appointment-update/appointment-update.component';
import { UsersGetAllComponent } from './components/individual-objects-pages/user-functions-pages/users-get-all/users-get-all.component';
import { UserGetAppointmentsComponent } from './components/individual-objects-pages/user-functions-pages/user-get-appointments/user-get-appointments.component';
import { UserUpdateComponent } from './components/individual-objects-pages/user-functions-pages/user-update/user-update.component';
import { PrescriptionGetAllComponent } from './components/individual-objects-pages/prescription-functions-pages/prescription-get-all/prescription-get-all.component';
import { PrescriptionDetailComponent } from './components/individual-objects-pages/prescription-functions-pages/prescription-detail/prescription-detail.component';
import { PrescriptionCreateComponent } from './components/individual-objects-pages/prescription-functions-pages/prescription-create/prescription-create.component';
import { PrescriptionUpdateComponent } from './components/individual-objects-pages/prescription-functions-pages/prescription-update/prescription-update.component';
import {MedicalRecordsListComponent} from './components/individual-objects-pages/medical-records-functions-pages/medical-records-list/medical-records-list.component';
import {
  MedicalRecordDeleteComponent
} from './components/individual-objects-pages/medical-records-functions-pages/medical-records-delete/medical-records-delete.component';
import {
  MedicalRecordEditComponent
} from './components/individual-objects-pages/medical-records-functions-pages/medical-records-edit/medical-records-edit.component';
import { UserGetPrescriptionsComponent } from './components/individual-objects-pages/user-functions-pages/user-get-prescriptions/user-get-prescriptions.component';
import { DoctorComponent } from './components/home/doctor/doctor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard] },
  { path: 'test-page', component: TestPageComponent, canActivate: [AuthGuard] },
  { path: 'create-patient', component: PatientCreateComponent, canActivate: [AuthGuard] },
  { path: 'get-all-patients', component: PatientGetAllComponent, canActivate: [AuthGuard] },
  { path: 'update-patient/:id', component: PatientUpdateComponent, canActivate: [AuthGuard] },
  { path: 'patient-detail/:id', component: PatientDetailComponent, canActivate: [AuthGuard] },
  { path: 'create-appointment', component: AppointmentCreateComponent, canActivate: [AuthGuard] },
  { path: 'get-all-appointments', component: AppointmentGetAllComponent, canActivate: [AuthGuard] },
  { path: 'appointment-detail/:id', component: AppointmentDetailComponent, canActivate: [AuthGuard] },
  { path: 'update-appointment/:id', component: AppointmentUpdateComponent, canActivate: [AuthGuard] },
  { path: 'get-all-users', component: UsersGetAllComponent, canActivate: [AuthGuard] },
  { path: 'update-user/:id', component: UserUpdateComponent, canActivate: [AuthGuard] },
  { path: 'get-user-appointments', component: UserGetAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'get-all-prescriptions', component: PrescriptionGetAllComponent, canActivate: [AuthGuard] },
  // { path: 'get-user-prescriptions', component: UserGetPrescriptionsComponent, canActivate: [AuthGuard] },
  { path: 'create-prescription', component: PrescriptionCreateComponent, canActivate: [AuthGuard] },
  { path: 'update-prescription/:id', component: PrescriptionUpdateComponent, canActivate: [AuthGuard] },
  { path: 'prescription-detail/:id', component: PrescriptionDetailComponent, canActivate: [AuthGuard] },
  { path: 'medical-records', component: MedicalRecordsListComponent, canActivate: [AuthGuard]  },
  { path: 'medical-records/:id/edit', component: MedicalRecordEditComponent, canActivate: [AuthGuard]  },
  { path: 'medical-records/:id/delete', component: MedicalRecordDeleteComponent, canActivate: [AuthGuard]  },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard] },
];
