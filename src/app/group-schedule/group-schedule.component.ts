import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-schedule',
  templateUrl: './group-schedule.component.html',
  styleUrls: ['./group-schedule.component.css']
})
export class GroupScheduleComponent implements OnInit {

  groups: AngularFirestoreCollection<any>;
  group: Observable<any>;

  teams: AngularFirestoreCollection<any>;
  team : Observable<any>;

  stage = [{id : 'Group'}, {id: 'Quarterfinal'}, {id: 'Semifinal'}, {id : 'Final'}];
  category = [{id: 'Lelaki'}, {id:'Perempuan'}];
  venue = [{id: 'Court A'}, {id:'Court B'}];
  zone = [{id: 'Tengah'}, {id:'Selatan'}, {id: 'Timur'}];
  kat;

  uid;
  admin : Boolean = false;

  constructor(private auth: AngularFireAuth, private fs: AngularFirestore) { 
    this.auth.authState.subscribe(item => {
      if(item){
        this.uid = item.uid;

        let adm : AngularFirestoreDocument<any> = this.fs.collection('users').doc(this.uid);
        let admin : Observable<any> = adm.valueChanges();
        admin.subscribe(a => {
          if(a.roles == 'admin'){
            this.admin = true;
          }else{
            this.admin = false;
          }
        })
      }
    })
    
  }

  ngOnInit() {
  }

  checkcategory(form){
    this.kat = form.value.category;
  }

  cancel(form){
    form.reset();
  }

  submitMatch(form){
    let time = new Date(form.value.date+ ' ' +form.value.time);
    let match_no = form.value.match;
    let n = match_no.toString();
  
    console.log(time);
    
    let home : AngularFirestoreDocument<any> = this.fs.collection('teams').doc(form.value.home);
    let homes : Observable<any> = home.valueChanges();

    homes.subscribe( i => {
      this.fs.collection('matches').doc(n).set({
        team1_name: i.team_name,
        category : form.value.category,
        datetime : time,
        description : form.value.stage,
        match_no: form.value.match,
        team1_id: form.value.home,
        team2_id: form.value.away,
        team1_score: 0,
        team2_score: 0,
        venue: form.value.venue,
        zone: form.value.zone
      })
    })

    let away : AngularFirestoreDocument<any> = this.fs.collection('teams').doc(form.value.away);
    let aways : Observable<any> = away.valueChanges();

    aways.subscribe( i => {
      this.fs.collection('matches').doc(n).update({
        team2_name: i.team_name
      })
    })
  }

  checkzone(form){
    this.teams = this.fs.collection('teams', ref => ref.where('is_confirm', '==', true).where('category', '==', this.kat).where('zone', '==', form.value.zone));
    this.team = this.teams.snapshotChanges().take(1).map(teams => {
      return teams.map(t => {
        const data = t.payload.doc.data();
        const id = t.payload.doc.id;

        return {data,id};
      })
    })
  }

}
