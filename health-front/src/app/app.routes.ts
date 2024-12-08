import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestPageComponent } from './components/test-page/test-page.component';
import { PatientCreateComponent } from './components/patient-create/patient-create.component';
import { PatientGetAllComponent } from './components/patient-get-all/patient-get-all.component';
import { PatientUpdateComponent } from './components/patient-update/patient-update.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'test-page', pathMatch: 'full' },
  { path: 'test-page', component: TestPageComponent },
  { path: 'create-patient', component: PatientCreateComponent },
  { path: 'get-all-patients', component: PatientGetAllComponent },
  { path: 'update-patient/:id', component: PatientUpdateComponent },
  { path: 'patient-detail/:id', component: PatientDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
