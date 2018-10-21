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
  zone = [{id: 'Tengah'}, {id:'Selatan'}, {id: 'Timur'},{id: 'Kebangsaan'}, {id: 'Alumni 2018'}];
  kat;
  zon;

  grouping : Boolean = false;
  quarter : Boolean = false;
  semi : Boolean = false;
  final : Boolean= false;


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

  test(event){
    if(event == 'Group'){
      this.grouping = true;
      this.quarter = false;
      this.semi = false;
      this.final = false;
    }else if(event == 'Quarterfinal'){
      this.grouping = false;
      this.quarter = true;
      this.semi = false;
      this.final = false;
    }else if(event == 'Semifinal'){
      this.grouping = false;
      this.quarter = false;;
      this.semi = true;
      this.final = false;
    }else if(event == 'Final'){
      this.grouping = false;
      this.quarter = false;
      this.semi = false;
      this.final = true;
    }else{
      this.grouping = false;
      this.quarter = false;
      this.semi = false;
      this.final = false;
    }
  }

  submitMatch(form){
    let grp_name = '';
    let time = new Date(form.value.date+ ' ' +form.value.time);
    let match_no = form.value.match;
    let n = match_no.toString();

    if(form.value.zone == 'Tengah'){
      grp_name = 'tgh'
    }else if(form.value.zone == 'Selatan'){
      grp_name = 'st'
    }else if(form.value.zone == 'Timur'){
      grp_name = 'tmr'
    }else if(form.value.zone == 'Alumni 2018'){
      grp_name = 'alumni'
    }else{
      grp_name = 'kbg'
    }
    
    let home : AngularFirestoreDocument<any> = this.fs.collection('teams').doc(form.value.home);
    let homes : Observable<any> = home.valueChanges();

    if(this.grouping == true || this.final == true){
      homes.subscribe( i => {
        this.fs.collection('matches').doc(grp_name+n).set({
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
          zone: form.value.zone,
          group: grp_name + form.value.group
        })
      })
    }else if(this.quarter == true){
      homes.subscribe( i => {
        this.fs.collection('matches').doc(grp_name+n).set({
          team1_name: i.team_name,
          category : form.value.category,
          datetime : time,
          description : form.value.stage+' '+form.value.qf,
          match_no: form.value.match,
          team1_id: form.value.home,
          team2_id: form.value.away,
          team1_score: 0,
          team2_score: 0,
          venue: form.value.venue,
          zone: form.value.zone,
        })
      })
    }else if(this.semi == true){
      homes.subscribe( i => {
        this.fs.collection('matches').doc(grp_name+n).set({
          team1_name: i.team_name,
          category : form.value.category,
          datetime : time,
          description : form.value.stage+' '+form.value.sf,
          match_no: form.value.match,
          team1_id: form.value.home,
          team2_id: form.value.away,
          team1_score: 0,
          team2_score: 0,
          venue: form.value.venue,
          zone: form.value.zone,
        })
      })
    }

    let away : AngularFirestoreDocument<any> = this.fs.collection('teams').doc(form.value.away);
    let aways : Observable<any> = away.valueChanges();

    aways.subscribe( i => {
      this.fs.collection('matches').doc(grp_name+n).update({
        team2_name: i.team_name
      })
    })
  }

  checkzone(form){
    this.zon = form.value.zone;
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
