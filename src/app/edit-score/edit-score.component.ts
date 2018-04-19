import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-score',
  templateUrl: './edit-score.component.html',
  styleUrls: ['./edit-score.component.css']
})
export class EditScoreComponent implements OnInit {

  game_id : any;
  team : any;
  top_score_home = [];
  top_score_away = [];
  top_3ptr_home = [];
  top_3ptr_away = [];

  display = true;
  insert = false;

  match: AngularFirestoreDocument<any>;
  match$: Observable<any>

  constructor(private route: ActivatedRoute, private fs: AngularFirestore, private router: Router) {
    this.game_id = this.route.snapshot.params['id'];

    this.match = this.fs.collection('matches').doc(this.game_id);
    this.match$ = this.match.valueChanges();

    this.match$.subscribe(x => console.log(x))
  }

  add(team){
    this.team = team;
    this.display = false;
    this.insert = true;
  }

  save(form){
    if(this.team == 'team1_scorer'){
      this.top_score_home.push({
        name: form.value.name,
        points: form.value.point
      })
    }else if(this.team == 'team2_scorer'){
      this.top_score_away.push({
        name: form.value.name,
        points: form.value.point
      })
    }else if(this.team == 'team1_3ptr'){
      this.top_3ptr_home.push({
        name: form.value.name,
        points: form.value.point
      })
    }else{
      this.top_3ptr_away.push({
        name: form.value.name,
        points: form.value.point
      })
    }

    this.display = true;
    this.insert = false;
  }



  ngOnInit() {
  }

  savetofb(){
    this.top_score_home.forEach(x => {
      this.fs.collection('matches').doc(this.game_id).collection('team1_scorer').add({
        name : x.name,
        points : x.points
      })
    })
    this.top_score_away.forEach(x => {
      this.fs.collection('matches').doc(this.game_id).collection('team2_scorer').add({
        name : x.name,
        points : x.points
      })
    })
    this.top_3ptr_home.forEach(x => {
      this.fs.collection('matches').doc(this.game_id).collection('team1_3ptr').add({
        name : x.name,
        points : x.points
      })
    })
    this.top_3ptr_away.forEach(x => {
      this.fs.collection('matches').doc(this.game_id).collection('team2_3ptr').add({
        name : x.name,
        points : x.points
      })
    })

    this.router.navigateByUrl('/schedule')
  }

  clear(){
    this.top_score_home = [];
    this.top_score_away = [];
    this.top_3ptr_home = [];
    this.top_3ptr_away = [];
  }

}
