import { Component, OnInit } from '@angular/core';
// import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-nba',
  templateUrl: './nba.component.html',
  styleUrls: ['./nba.component.css']
})
export class NbaComponent implements OnInit {

  players: AngularFirestoreCollection<any>;
  _players : Observable<any>;

  constructor(private fs: AngularFirestore) { 
    this.players = this.fs.collection('nba', ref => ref.orderBy('payment', 'desc'));
    this._players = this.players.snapshotChanges().map(pl => {
      return pl.map(p => {
        const data = p.payload.doc.data();
        const key = p.payload.doc.id;

        return {key,data};
      })
    })
  }

  ngOnInit() {

  }

  make_payment(key){
    this.fs.collection('nba').doc(key).update({
      payment : true
    })
  }

  cancel_payment(key){
    this.fs.collection('nba').doc(key).update({
      payment : false
    })
  }

}
