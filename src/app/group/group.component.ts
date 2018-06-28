import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  teamCollection : AngularFirestoreCollection<any>;
  tCollection: Observable<any>
  id = [{id: 'Lelaki'}, {id: 'Perempuan'}]
  teams;
  groupL: AngularFirestoreCollection<any>;
  groupsL: Observable<any>;

  team: AngularFirestoreCollection<any>;
  team$ : Observable<any>;

  groupP: AngularFirestoreCollection<any>;
  groupsP: Observable<any>;

  findteam: Boolean = false;
  register: Boolean = false;
  
  zone = [{id: '----'},{id: 'Tengah'}, {id:'Selatan'}, {id: 'Timur'}, {id: 'Kebangsaan'}, {id: 'Alumni'}];

  teamName;
  add : Boolean = false;
  err : Boolean = false;

  cpy: Observable<any>;

  constructor(private fs: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
  }

  test(event){
    this.groupL = this.fs.collection('groups', ref=> ref.where('category', '==', 'Lelaki').where('zone', '==', event));
    this.groupsL = this.groupL.snapshotChanges().map(item => {
      return item.map(i => {
        const data = i.payload.doc.data();
        const id = i.payload.doc.id;

        let teamList = this.fs.collection('groups/'+id+'/team_list', ref => {return ref.orderBy('pos')}).snapshotChanges().take(1).map(xtem => {
          return xtem.map(x => {
            const data = x.payload.doc.data();
            const id = x.payload.doc.id;

            return {id, data}
          })
        })

        return {id,data, teamList};
      })
    })

    this.groupP = this.fs.collection('groups', ref=> ref.where('category', '==', 'Perempuan').where('zone', '==', event));
    this.groupsP = this.groupP.snapshotChanges().map(item => {
      return item.map(i => {
        const data = i.payload.doc.data();
        const id = i.payload.doc.id;

        let teamList = this.fs.collection('groups/'+id+'/team_list', ref => {return ref.orderBy('pos')}).snapshotChanges().take(1).map(xtem => {
          return xtem.map(x => {
            const data = x.payload.doc.data();
            const id = x.payload.doc.id;

            return {id, data}
          })
        })

        return {id,data, teamList};
      })
    })
  }

  ngOnInit() {
  }

  searchteam(form){
    this.teams = [];
    this.findteam = true;
    if(form.value.category == 'Lelaki'){
      this.teamCollection = this.fs.collection('teams', ref=> ref.where('category', '==', 'Lelaki').where('is_confirm', '==', true));
      this.tCollection = this.teamCollection.snapshotChanges().take(1).map(team => {
        return team.map(t => {
          const data = t.payload.doc.data();
          const id = t.payload.doc.id;
          return {data, id};
        })
      })
    }else {
      this.teamCollection = this.fs.collection('teams', ref=> ref.where('category', '==', 'Perempuan').where('is_confirm', '==', true));
      this.tCollection = this.teamCollection.snapshotChanges().take(1).map(team => {
        return team.map(t => {
          const data = t.payload.doc.data();
          const id = t.payload.doc.id;
          return {data, id};
        })
      })
    }
  }

  addToGroup(form: NgForm){

    let grp_name = '';
    if(form.value.zone == 'Tengah'){
      grp_name = 'TGH';
    }else if(form.value.zone == 'Selatan'){
      grp_name = 'SLT';
    }else if(form.value.zone == 'Timur'){
      grp_name = 'TMR';
    }else if(form.value.zone == 'Alumni'){
      grp_name = 'ALM'
    }else{
      grp_name = 'KBG'
    }

    if(form.valid){
      const collection : AngularFirestoreDocument<any> = this.fs.collection('teams').doc(form.value.team);
      const c : Observable<any> = collection.valueChanges();
  
      c.subscribe(data => {
        this.teamName = data.team_name;
        
        this.fs.collection('groups').doc(grp_name+form.value.gname).set({
          category: form.value.category,
          group_name: form.value.gname,
          zone: form.value.zone,
        }, {merge: true});
  
        this.fs.collection('groups').doc(grp_name+form.value.gname).collection('team_list').doc(form.value.team).set({
          lost: 0,
          played: 0,
          points: 0,
          win: 0,
          gd: 0,
          team_name: this.teamName,
          pos: form.value.pos
        })
      });
  
      this.add = !this.add;
  
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setTimeout(function () {
        this.add = false;
      }.bind(this), 3000);
    }else{
      this.err = !this.err;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setTimeout(function () {
        this.err = false;
      }.bind(this), 3000);

    }
    
  }

  back(){
    this.findteam = false;
    this.register = !this.register;
  }

  changeView(){
    this.register = !this.register;
  }

  logout(){
    this.auth.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
