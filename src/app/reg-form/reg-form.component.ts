import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firestore from 'angularfire2/firestore';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.css']
})
export class RegFormComponent implements OnInit {

  playerlist: Boolean = true;
  newPlayer = [];
  addform:Boolean = false;
  teamList: AngularFirestoreCollection<any>;
  teamList$: Observable<any>;
  id;
  teamConfirm: AngularFirestoreCollection<any>;
  teamConfirm$: Observable<any>;

  category = [{id: 'Lelaki'}, {id: 'Perempuan'}];
  zone = [{id: 'Tengah'}, {id:'Selatan'}, {id: 'Timur'}];

  success: Boolean = false;
  err : Boolean = false;

  constructor(private firestore: AngularFirestore) {
    this.teamList = this.firestore.collection('teams', ref => ref.where('is_confirm', '==', false))
    this.teamList$ = this.teamList.snapshotChanges().map(items=> {
      return items.map(i => {
        const data = i.payload.doc.data();
        const id =  i.payload.doc.id;
        return {id,data};
      })
    })

    this.teamConfirm = this.firestore.collection('teams', ref => ref.where('is_confirm', '==', true).orderBy('zone').orderBy('category'));
    this.teamConfirm$ = this.teamConfirm.snapshotChanges().map(items=> {
      return items.map(i => {
        const data = i.payload.doc.data();
        const id =  i.payload.doc.id;
        return {id,data};
      })
    })
  }

  ngOnInit() {
  }

  addplayer(){
    this.playerlist = !this.playerlist;
  }

  addedplayer(player){
    let addnewPlayer = {name: player.value.name, jersi: player.value.jersi};
    this.newPlayer.push(addnewPlayer);
    this.playerlist = !this.playerlist;
  }

  cancelplayer(){
    this.playerlist = !this.playerlist;
  }

  addnewteam(){
    this.addform = !this.addform
  }

  addTeam(registerForm: NgForm){

    if(registerForm.valid)
    {this.firestore.collection('teams').add({
      team_name: registerForm.value.team,
      coach: registerForm.value.coach,
      assistant_coach: registerForm.value.atcoach,
      manager: registerForm.value.guru,
      category: registerForm.value.category,
      zone: registerForm.value.zone,
      is_confirm: false,
      pos: registerForm.value.pos
      }).then(ref => {
        this.newPlayer.forEach(item => {
          this.firestore.collection('teams').doc(ref.id).collection('players').add({
            player_name: item.name, player_jersey: item.jersi
          })
        })
      })

      this.success = !this.success;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setTimeout(function () {
        this.success = false;
        this.newPlayer = [];
      }.bind(this), 3000);

      this.addform = !this.addform;}else{
        this.err = !this.err;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        setTimeout(function () {
          this.err = false;
        }.bind(this), 3000);
      }

  }

  confirm(id){
    const data: AngularFirestoreDocument<any> = this.firestore.doc('teams/'+id);
    data.update({
      is_confirm : true
    })
  }

  cancel(){
    this.addform = !this.addform;
  }

}
