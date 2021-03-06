import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import {Upload} from '../upload.model';
import {UploadService} from '../service/upload.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  tid;
  newPlayer : Boolean = false;
  uplayer : Boolean = false;
  pid;
  success : Boolean = false;

  file:any;

  teams: AngularFirestoreDocument<any>;
  team: Observable<any>;

  oldPlayers: AngularFirestoreCollection<any>;
  oldPlayer: Observable<any>;

  uploading: Upload;

  player: Observable<any>;

  surat_image;

  constructor(private fs: AngularFirestore, private aRouter: ActivatedRoute, private router: Router, private uSvc: UploadService) {

    this.tid = this.aRouter.snapshot.params['id'];
    
    this.teams = this.fs.collection('teams').doc(this.tid);
    this.team = this.teams.valueChanges();

    this.oldPlayers = this.fs.collection('teams/'+this.tid+'/players');
    this.oldPlayer = this.oldPlayers.snapshotChanges().map((x)=>{
      return x.map(y => {
        const data = y.payload.doc.data();
        const id = y.payload.doc.id;

        return {data,id}
      })
    });
  }

  ngOnInit() {
  }

  surat(event){
    this.file = event.target.files;
  }

  eplayer(id){
    this.pid = id;
    let p : AngularFirestoreDocument<any> = this.fs.collection('teams').doc(this.tid).collection('players').doc(id);
    this.player = p.valueChanges();

    this.player.subscribe(x => {
      this.surat_image = x.surat;
    });
  }

  addedplayer(playerForm){
    // console.log(playerForm.value.name,playerForm.value.jersey,playerForm.value.ic);
    
    this.fs.collection('teams').doc(this.tid).collection('players').add({
      player_name: playerForm.value.name,
      player_jersey: playerForm.value.jersey,
      player_ic: playerForm.value.ic,
    }).then((x)=>{
      const filesToUpload = this.file;
      const filesIndex = _.range(filesToUpload.length);
      _.each(filesIndex, (idx) => {
        this.uploading = new Upload(filesToUpload[idx]);
        this.uSvc.uploadImage(this.uploading,x.id,this.tid);
      });
      
      this.newPlayer = false;
      playerForm.reset();
    })
  }

  addplayer(){
    this.newPlayer = true;
  }

  cancelplayer(){
    this.newPlayer = false;
    this.uplayer = false;
  }

  cancel(){
    this.router.navigateByUrl('/teamreg/'+this.tid)
  }

  updateplayer(playerForm){
    this.fs.collection('teams').doc(this.tid).collection('players').doc(this.pid).update({
      player_name: playerForm.value.name,
      player_jersey: playerForm.value.jersey,
      player_ic: playerForm.value.ic
    }).then(()=>{
      const filesToUpload = this.file;
      const filesIndex = _.range(filesToUpload.length);
      _.each(filesIndex, (idx) => {
        this.uploading = new Upload(filesToUpload[idx]);
        this.uSvc.uploadImage(this.uploading,this.pid,this.tid);
      });
      this.uplayer = false;
    })
  }

  UpdateTeam(registerForm){
    this.fs.collection('teams').doc(this.tid).set({
      team_name: registerForm.value.team,
      coach: registerForm.value.coach,
      assistant_coach: registerForm.value.atcoach,
      zone: 'Alumni 2018',
      is_confirm: true,
      category: 'Lelaki'
    }).then(()=>{
      this.success = true;
    })
  }

  dplayer(id){
    this.fs.collection('teams').doc(this.tid).collection('players').doc(id).delete();
  }

}
