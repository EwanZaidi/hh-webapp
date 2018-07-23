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
  addform: Boolean = false;
  teamList: AngularFirestoreCollection<any>;
  teamList$: Observable<any>;
  id;
  teamConfirm: AngularFirestoreCollection<any>;
  teamConfirm$: Observable<any>;

  category = [{ id: 'Lelaki' }, { id: 'Perempuan' }];
  zone = [{ id: 'Tengah' }, { id: 'Selatan' }, { id: 'Timur' }, { id: 'Kebangsaan' }];

  success: Boolean = false;
  err: Boolean = false;
  editform: Boolean = false;
  teamlist: Boolean = true;

  ids:any;
  surat_image;

  team: Observable<any>;
  updateId;
  verified : Array<Boolean>;
  oldPlayer: Observable<any>;
  uplayer: Boolean = false;
  playerid;
  player: Observable<any>;

  constructor(private firestore: AngularFirestore) {
    this.teamList = this.firestore.collection('teams', ref => ref.where('is_confirm', '==', false))
    this.teamList$ = this.teamList.snapshotChanges().map(items => {
      return items.map(i => {
        const data = i.payload.doc.data();
        const id = i.payload.doc.id;
        return { id, data };
      })
    })

    this.teamConfirm = this.firestore.collection('teams', ref => ref.where('is_confirm', '==', true).orderBy('zone').orderBy('category'));
    this.teamConfirm$ = this.teamConfirm.snapshotChanges().map(items => {
      return items.map(i => {
        const data = i.payload.doc.data();
        const id = i.payload.doc.id;
        return { id, data };
      })
    })
  }

  ngOnInit() {
  }

  addplayer() {
    this.playerlist = !this.playerlist;
  }

  addedplayer(player) {
    let addnewPlayer = { name: player.value.name, jersi: player.value.jersi };
    this.newPlayer.push(addnewPlayer);
    this.playerlist = !this.playerlist;
  }

  seeSurat(surat){
    this.surat_image = surat;
  }

  cancelplayer() {
    this.playerlist = true;
    this.uplayer = false;
  }

  addnewteam() {
    this.addform = !this.addform;
    this.teamlist = false;
  }

  addTeam(registerForm: NgForm) {

    let grp_name = '';

    if (registerForm.value.zone == 'Tengah') {
      grp_name = 'TGH';
    } else if (registerForm.value.zone == 'Selatan') {
      grp_name = 'SLT';
    } else if (registerForm.value.zone == 'Timur') {
      grp_name = 'TMR';
    } else {
      grp_name = 'KBG'
    }

    if (registerForm.valid) {
      this.firestore.collection('teams').add({
        team_name: registerForm.value.team,
        coach: registerForm.value.coach,
        assistant_coach: registerForm.value.atcoach,
        manager: registerForm.value.guru,
        category: registerForm.value.category,
        zone: registerForm.value.zone,
        is_confirm: false
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

      this.addform = !this.addform;
      this.teamlist = true;
    } else {
      this.err = !this.err;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setTimeout(function () {
        this.err = false;
      }.bind(this), 3000);
    }

  }

  confirm(id) {
    const data: AngularFirestoreDocument<any> = this.firestore.doc('teams/' + id);
    data.update({
      is_confirm: true
    })
  }

  cancel() {
    this.addform = false;
    this.teamlist = true;
    this.editform = false;
  }

  edit(id) {
    this.editform = true;
    this.teamlist = false;
    this.addform = false;

    this.updateId = id;

    let teams: AngularFirestoreDocument<any> = this.firestore.collection('teams').doc(id);
    this.team = teams.valueChanges();

    let player: AngularFirestoreCollection<any> = this.firestore.collection('teams').doc(id).collection('players');
    this.oldPlayer = player.snapshotChanges().map(p => {
      return p.map(pl => {
        const data = pl.payload.doc.data();
        const id = pl.payload.doc.id;

        if(data.verify_status == null){
          data.verify_status = false;
        }

        data.status = data.verify_status?data.verify_status:false;
        data.image = data.surat?data.surat:'';

        return { data, id };
      })
    })

    this.oldPlayer.subscribe(x => {
      let i = 0;
      x.forEach(y => {
        this.verifyPlayer[i] = y.data.status;
        i++
      })
    })

  }

  verifyPlayer(i,id){
    this.verifyPlayer[i] = !this.verifyPlayer[i];
    this.firestore.collection('teams').doc(this.updateId).collection('players').doc(id).update({
      verify_status : this.verifyPlayer[i]
    })
  }

  UpdateTeam(registerForm: NgForm) {

    let grp_name = '';

    if (registerForm.value.zone == 'Tengah') {
      grp_name = 'TGH';
    } else if (registerForm.value.zone == 'Selatan') {
      grp_name = 'SLT';
    } else if (registerForm.value.zone == 'Timur') {
      grp_name = 'TMR';
    } else {
      grp_name = 'KBG'
    }

    if (registerForm.valid) {
      this.firestore.collection('teams').doc(this.updateId).update({
        team_name: registerForm.value.team,
        coach: registerForm.value.coach,
        assistant_coach: registerForm.value.atcoach,
        manager: registerForm.value.guru,
        category: registerForm.value.category,
        zone: registerForm.value.zone,
      }).then(ref => {
        this.newPlayer.forEach(item => {
          this.firestore.collection('teams').doc(this.updateId).collection('players').add({
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

      this.addform = false;
      this.teamlist = true;
      this.editform = false;
    } else {
      this.addform = !this.addform;
      this.teamlist = true;
      this.editform = false;
      this.err = !this.err;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setTimeout(function () {
        this.err = false;
      }.bind(this), 3000);
    }
  }

  eplayer(id) {
    this.playerid = id;
    this.uplayer = true;

    let p: AngularFirestoreDocument<any> = this.firestore.collection('teams').doc(this.updateId).collection('players').doc(id);
    this.player = p.valueChanges();
  }

  updateplayer(playerForm) {
    this.firestore.collection('teams').doc(this.updateId).collection('players').doc(this.playerid).update({
      player_name: playerForm.value.name,
      player_jersey: playerForm.value.jersi
    }).then(t => {
      this.uplayer = false;
    })

  }

  copyteam() {
    let old: AngularFirestoreCollection<any> = this.firestore.collection('teams', ref => ref.where('team_name', '==', 'SMSS').where('zone', '==', 'Tengah').where('category','==', 'Lelaki'));
    let olds: Observable<any> = old.snapshotChanges().map((items) => {
      return items.map(i => {
        const data = i.payload.doc.data();
        const id = i.payload.doc.id;

        return { data, id }
      })
    })

    

    olds.subscribe(a => {
      console.log(a);
      let p: AngularFirestoreCollection<any> = this.firestore.collection('teams').doc(a[0].id).collection('players');
      let player: Observable<any> = p.snapshotChanges().map((players) => {
        return players.map(p => {
          const data = p.payload.doc.data();
          const id = p.payload.doc.id;

          return { data, id }
        })
      })

      this.firestore.collection('teams').doc('E935dvkJ8fgIRciCRvGH').update({
        coach: a[0].data.coach,
        manager: a[0].data.manager,
        assistant_coach: a[0].data.assistant_coach
      })

      player.subscribe(p => {
        p.forEach(x => {
          this.firestore.collection('teams').doc('E935dvkJ8fgIRciCRvGH').collection('players').doc(x.id).set({
            player_name: x.data.player_name,
            player_jersey: x.data.player_jersey
          })
        })
      })
    })

  }

}
