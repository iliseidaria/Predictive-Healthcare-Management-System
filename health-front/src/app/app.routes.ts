import { Routes } from '@angular/router';
import { TestPageComponent } from './components/test-page/test-page.component';
import { PatientCreateComponent } from './components/patient-create/patient-create.component';
import { PatientGetAllComponent } from './components/patient-get-all/patient-get-all.component';
import { PatientUpdateComponent } from './components/patient-update/patient-update.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './services/guards/auth.guard';
import { NonAuthGuard } from './services/guards/non-auth.guard';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';
import { AppointmentGetAllComponent } from './components/appointment-get-all/appointment-get-all.component';
import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';
import { AppointmentUpdateComponent } from './components/appointment-update/appointment-update.component';
import { UsersGetAllComponent } from './components/users-get-all/users-get-all.component';
import { UserGetAppointmentsComponent } from './components/user-get-appointments/user-get-appointments.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { PrescriptionGetAllComponent } from './components/prescription-get-all/prescription-get-all.component';
import { PrescriptionDetailComponent } from './components/prescription-detail/prescription-detail.component';
import { PrescriptionCreateComponent } from './components/prescription-create/prescription-create.component';
import { PrescriptionUpdateComponent } from './components/prescription-update/prescription-update.component';
import { UserGetPrescriptionsComponent } from './components/user-get-prescriptions/user-get-prescriptions.component';

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
  { path: 'get-user-prescriptions', component: UserGetPrescriptionsComponent, canActivate: [AuthGuard] },
  { path: 'create-prescription', component: PrescriptionCreateComponent, canActivate: [AuthGuard] },
  { path: 'update-prescription/:id', component: PrescriptionUpdateComponent, canActivate: [AuthGuard] },
  { path: 'prescription-detail/:id', component: PrescriptionDetailComponent, canActivate: [AuthGuard] },
];