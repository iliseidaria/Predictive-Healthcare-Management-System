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

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard] },
  { path: 'test-page', component: TestPageComponent, canActivate: [AuthGuard] },
  { path: 'create-patient', component: PatientCreateComponent, canActivate: [AuthGuard] },
  { path: 'get-all-patients', component: PatientGetAllComponent, canActivate: [AuthGuard] },
  { path: 'update-patient/:id', component: PatientUpdateComponent, canActivate: [AuthGuard] },
  { path: 'patient-detail/:id', component: PatientDetailComponent, canActivate: [AuthGuard] },
];