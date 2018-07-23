import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';


@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {



  scoreboard: Observable<any>;
  home_players: Observable<any>;
  guest_players: Observable<any>

  home_foul: number;
  guest_foul: number;
  home_score: number = 0;
  guest_score: number;
  period: number;
  ball_pos: Boolean;
  allsecond: number;
  all24: number;
  display_minute: number;
  display_second: number;

  home = 'HOME';
  away = 'AWAY';

  mySound = new Audio("../../assets/sounds/buzz.wav");
  sound: Boolean;

  guest_bonus: Boolean;
  home_bonus: Boolean;

  input : boolean = false;



  constructor(private fs: AngularFirestore) {
    this.scoreboard = this.fs.collection('scoreboard').doc('alumni1').valueChanges();
    this.scoreboard.subscribe((d) => {
      this.home_foul = d.home_foul;
      this.home_score = d.home_score;
      this.guest_foul = d.guest_foul;
      this.guest_score = d.guest_score;
      this.period = d.period;
      this.ball_pos = d.pos;
      this.allsecond = d.seconds;
      this.all24 = d.timer;
      this.display_minute = Math.floor(this.allsecond / 60);
      this.display_second = this.allsecond - this.display_minute * 60;
      this.home_bonus = d.home_bonus;
      this.guest_bonus = d.guest_bonus;
      this.sound = d.buzz;
    });


    // let h_points : Observable<any> = this.fs.collection('scoreboard').doc('alumni1').collection('home_players').valueChanges();
    // h_points.subscribe((x) => {
    //   x.forEach(p => {
    //     this.home_score = this.home_score + p.points;
    //   })
    // })

    // let a_points : Observable<any> = this.fs.collection('scoreboard').doc('alumni1').collection('guest_players').valueChanges();
    // a_points.subscribe((x) => {
    //   x.forEach(p => {
    //     this.guest_score = this.guest_score + p.points;
    //   })
    // })

    this.home_players = this.fs.collection('scoreboard').doc('alumni1').collection('home_players', ref=> ref.where('first_five','==', true)).valueChanges();
    this.home_players.subscribe();

    this.guest_players = this.fs.collection('scoreboard').doc('alumni1').collection('guest_players', ref=> ref.where('first_five','==', true)).valueChanges();
    this.guest_players.subscribe()
  }

  

  ngOnInit() {

  }

}
