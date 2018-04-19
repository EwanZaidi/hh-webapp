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



@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    RegFormComponent,
    GroupComponent,
    GroupScheduleComponent,
    ResultComponent,
    HomepageComponent,
    EditScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    RouterModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
