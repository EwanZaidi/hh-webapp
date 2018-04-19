import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  matches : AngularFirestoreCollection<any>;
  match : Observable<any>;

  result=[];
  editinput=[];
  zone = [{id: 'Tengah'}, {id:'Selatan'}, {id: 'Timur'}];
  uid;
  admin : Boolean = false;
  test: any;

  constructor(private auth: AngularFireAuth, private fs: AngularFirestore, private router: Router) { 
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

  cancel(index){
    this.result[index] = false;
    this.editinput[index] = false;
  }

  selDate(form){
    // let time = new Date(form.value.date+ ' ' +form.value.time);
    let time = new Date(form.value.date);
    time.setHours(time.getHours() - 1);
    let tomorrow = new Date(form.value.date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log(tomorrow);
    

    this.matches = this.fs.collection('matches', ref => ref.where('datetime', '>=', time).where('datetime', '<', tomorrow).where('zone', '==', form.value.zone).orderBy('datetime','asc').orderBy('match_no', 'asc'));
    this.match = this.matches.snapshotChanges().map(m => {
      return m.map(ma => {
        
        const data = ma.payload.doc.data();
        const id = ma.payload.doc.id;
        

        return {data,id}
      })
    })

    this.match.subscribe();


  }

  edit(me){
    if (this.result[me] == false) {
      this.editinput[me] = true;
      this.result[me] = true;
    }
    else {
      this.editinput[me] = true;
      this.result[me] = true;
    }  
  }

  editscore(me){
    this.router.navigateByUrl('/edit/'+me)

  }

  addScore(form,id,index){
    this.fs.collection('matches').doc(id).update({
      team1_score: form.value.homescore,
      team2_score: form.value.awayscore,
      team1_top_scorer: form.value.hometopscore,
      team2_top_scorer: form.value.awaytopscore,
      team1_3ptr: form.value.home3pt,
      team2_3ptr: form.value.away3pt
    }).then(x => {
      this.result[index] = false;
      this.editinput[index] = false;
    })

    let team : AngularFirestoreDocument<any> = this.fs.collection('matches').doc('id');
    let t : Observable<any> = team.snapshotChanges().take(1).map(x => {
      const data = x.payload.data();
      const id = x.payload.id;

      let a = data.team1_id;
      let b = data.team2_id

      console.log(a, b);
      


      return {data,id}
    })


  }

}
