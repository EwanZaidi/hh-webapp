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
import { EditScoreComponent } from './edit-score/edit-score.component';
import { RegTeamComponent } from './reg-team/reg-team.component';
import { AuthService2 } from './service/auth2.service';
import { ManageComponent } from './manage/manage.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent, pathMatch: 'full' },
  { path: 'admin/register', component: RegFormComponent, canActivate: [AuthService]},
  { path: 'admin/group', component: GroupComponent,canActivate: [AuthService]},
  {path: 'admin/schedule', component: ResultComponent,canActivate: [AuthService]},
  {path: 'admin/match', component: GroupScheduleComponent,canActivate: [AuthService]},
  {path: 'admin/home', component: HomepageComponent, canActivate: [AuthService]},
  {path: 'admin/edit/:id', component: EditScoreComponent, canActivate: [AuthService]},
  {path: 'teamreg/:id', component: RegTeamComponent, canActivate: [AuthService2]},
  {path: 'teamreg/:id/manage', component: ManageComponent, canActivate: [AuthService2]},
  {path:'admin', component: AdminComponent, pathMatch: 'full'}
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
