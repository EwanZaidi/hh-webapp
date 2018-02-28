import { HomepageComponent } from './homepage/homepage.component';
import { AuthService } from './service/auth.service';
import { GroupScheduleComponent } from './group-schedule/group-schedule.component';
import { ResultComponent } from './result/result.component';
import { RegFormComponent } from './reg-form/reg-form.component';
import { RegistrationComponent } from './registration/registration.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent, pathMatch: 'full' },
  { path: 'register', component: RegFormComponent, canActivate: [AuthService]},
  { path: 'group', component: GroupComponent,canActivate: [AuthService]},
  {path: 'schedule', component: ResultComponent,canActivate: [AuthService]},
  {path: 'match', component: GroupScheduleComponent,canActivate: [AuthService]},
  {path: 'home', component: HomepageComponent, canActivate: [AuthService]}
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
