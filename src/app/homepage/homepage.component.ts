import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  uid;
  admin : Boolean = false;

  match: Observable<any>;

  match_key: any;

  constructor(private auth: AngularFireAuth, private router: Router, private fs: AngularFirestore) { 
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

        let matches: AngularFirestoreCollection<any> = this.fs.collection('matches', ref => ref.where('zone', '==', 'Tengah'));
        this.match = matches.snapshotChanges().map(x => {
          return x.map(y => {
            const key = y.payload.doc.id;
            const val = y.payload.doc.data();

            return {key,val};
          })
        })
      }
    })
    
  }

  ngOnInit() {
  }

  change(val){
    this.match_key = val;
  }

  logout(){
    this.auth.auth.signOut();
    this.router.navigateByUrl('/');
  }

  go(){
    this.router.navigateByUrl(`/admin/${this.match_key}/scoreboard`);
  }

}
