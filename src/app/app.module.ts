import { AuthService } from './service/auth.service';
import { environment } from './../environments/environment';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { RegistrationComponent } from './registration/registration.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RegFormComponent } from './reg-form/reg-form.component';
import { GroupComponent } from './group/group.component';
import { GroupScheduleComponent } from './group-schedule/group-schedule.component';
import { ResultComponent } from './result/result.component';

export const firebaseConfig = environment.firebaseConfig;
import { HomepageComponent } from './homepage/homepage.component';
import { EditScoreComponent } from './edit-score/edit-score.component';
import { RegTeamComponent } from './reg-team/reg-team.component';
import { AuthService2 } from './service/auth2.service';
import { UploadService } from './service/upload.service';
import { ManageComponent } from './manage/manage.component';
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { ScoreboardControllerComponent } from './scoreboard-controller/scoreboard-controller.component';

import { ModalModule } from 'ngx-bootstrap';
import { NbaComponent } from './nba/nba.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    RegFormComponent,
    GroupComponent,
    GroupScheduleComponent,
    ResultComponent,
    HomepageComponent,
    EditScoreComponent,
    RegTeamComponent,
    ManageComponent,
    AdminComponent,
    ChangePasswordComponent,
    ScoreboardComponent,
    ScoreboardControllerComponent,
    NbaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    RouterModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    ModalModule.forRoot(),
    PdfViewerModule
  ],
  providers: [AuthService,AuthService2, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
