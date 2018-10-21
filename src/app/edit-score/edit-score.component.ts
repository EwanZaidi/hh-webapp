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

  top_home : Observable<any>;
  top_away: Observable<any>;
  home_3ptr: Observable<any>;
  away_3ptr: Observable<any>;

  display = true;
  insert = false;
  editF = false;
  insert3pt = false;

  editName: any;
  editPoints: number;

  i: number;



  match: AngularFirestoreDocument<any>;
  match$: Observable<any>

  constructor(private route: ActivatedRoute, private fs: AngularFirestore, private router: Router) {
    this.game_id = this.route.snapshot.params['id'];

    this.match = this.fs.collection('matches').doc(this.game_id);
    this.match$ = this.match.valueChanges();

    this.match$.subscribe(x => console.log(x))

    this.top_home = this.fs.collection('matches').doc(this.game_id).collection('team1_scorer').snapshotChanges().map((a) => {
      return a.map((b) => {
        const id = b.payload.doc.id;
        const data = b.payload.doc.data();

        return {id, data}
      })
    })
    this.top_away = this.fs.collection('matches').doc(this.game_id).collection('team2_scorer').snapshotChanges().map((a) => {
      return a.map((b) => {
        const id = b.payload.doc.id;
        const data = b.payload.doc.data();

        return {id, data}
      })
    })
    this.home_3ptr = this.fs.collection('matches').doc(this.game_id).collection('team1_3ptr').snapshotChanges().map((a) => {
      return a.map((b) => {
        const id = b.payload.doc.id;
        const data = b.payload.doc.data();

        return {id, data}
      })
    })
    this.away_3ptr = this.fs.collection('matches').doc(this.game_id).collection('team2_3ptr').snapshotChanges().map((a) => {
      return a.map((b) => {
        const id = b.payload.doc.id;
        const data = b.payload.doc.data();

        return {id, data}
      })
    })

  }

  add(team){
    this.team = team;
    this.display = false;
    this.insert = true;
  }

  add2(team){
    this.team = team;
    this.display = false;
    this.insert3pt = true;
    this.insert = false;
  }

  back(){
    this.router.navigateByUrl('/admin/schedule')
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
    this.insert3pt = false;
  }



  ngOnInit() {
  }
  
  cancel(){
    this.display = true;
    this.insert = false;
    this.editF = false;
    this.insert3pt = false;
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

    this.router.navigateByUrl('/admin/schedule')
  }

  clear(){
    this.top_score_home = [];
    this.top_score_away = [];
    this.top_3ptr_home = [];
    this.top_3ptr_away = [];
  }

  edit(i, name, points){
    this.i = i;
    this.editName = name;
    this.editPoints = points;

    this.editF = true;
    this.display = false;
    this.insert = false;
  }

  delete3ptrHome(i){
    let index = i;
    this.top_3ptr_home.splice(index, 1)
  }

  delete3ptrAway(i){
    let index = i;
    this.top_3ptr_away.splice(index, 1)
  }

  deleteTopHome(i){
    let index = i;
    this.top_score_home.splice(index, 1)
  }

  deleteTopAway(i){
    let index = i;
    this.top_score_away.splice(index, 1)
  }
  
  delete3ptrA(id){
    this.fs.collection('matches').doc(this.game_id).collection('team2_3ptr').doc(id).delete();
  }

  delete3ptrH(id){
    this.fs.collection('matches').doc(this.game_id).collection('team1_3ptr').doc(id).delete();
  }

  deleteAway(id){
    this.fs.collection('matches').doc(this.game_id).collection('team2_scorer').doc(id).delete();
  }

  deleteHome(id){
    this.fs.collection('matches').doc(this.game_id).collection('team1_scorer').doc(id).delete();
  }

}
