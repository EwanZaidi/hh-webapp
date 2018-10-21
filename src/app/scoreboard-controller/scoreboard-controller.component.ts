import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';

@Component({
  selector: 'app-scoreboard-controller',
  templateUrl: './scoreboard-controller.component.html',
  styleUrls: ['./scoreboard-controller.component.css']
})
export class ScoreboardControllerComponent implements OnInit {

  key: any;
  seconds: Observable<any>;
  s: AngularFirestoreDocument<any>;
  allsecond: number;
  all24: number;
  display_minute: number;
  display_second: number;

  start: Boolean = false;
  st24: Boolean = false;

  home_foul: number;
  guest_foul: number;

  home_score: number;
  guest_score: number;

  home_bonus: Boolean = false;
  guest_bonus: Boolean = false;

  period: number;

  timer:any;

  timer24:any;

  ball_pos: Boolean;

  buzz: Boolean;

  mySound = new Audio("../../assets/sounds/buzz.wav");

  constructor(private route: ActivatedRoute, private fs: AngularFirestore) {
    // this.key = this.route.snapshot.params['id'];
    this.s = this.fs.collection('scoreboard').doc('alumni1');
    this.seconds = this.s.snapshotChanges().map(x => {
      const data = x.payload.data();
      const key = x.payload.id;

      return { data, key }
    });

    this.seconds.subscribe(d=>{
      this.home_foul = d.data.home_foul;
      this.guest_foul = d.data.guest_foul;
      this.home_score = d.data.home_score;
      this.guest_score = d.data.guest_score;
      this.period = d.data.period;
      this.ball_pos = d.data.pos;
      this.allsecond = d.data.seconds;
      this.all24 = d.data.timer;
      this.display_minute = Math.floor(this.allsecond / 60);
      this.display_second = this.allsecond - this.display_minute * 60;
      this.home_bonus = d.data.home_bonus;
      this.guest_bonus = d.data.guest_bonus;
      this.buzz = d.data.buzz;
      
      if(this.all24 == 0){
        this.mySound.play();
        this.buzzer();
        clearInterval(this.timer);
        clearInterval(this.timer24);
      }else if(this.allsecond == 0){
        this.mySound.play();
        this.buzzer();
        clearInterval(this.timer);
        clearInterval(this.timer24);
      }else if(this.allsecond < 0){
        clearInterval(this.timer);
        clearInterval(this.timer24);
      }

    });


   

  }

  ngOnInit() {

  }

  buzzer(){
    this.mySound.play();
  }

  clearPoints(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      home_score : 0,
      guest_score: 0
    })
  }

  startTimer() {
    this.timer =  setInterval(() => {
      this.timeChange();
    }, 1000);

    this.start = !this.start;
  }

  stopTimer(){
    clearInterval(this.timer);

    this.start = !this.start;
  }

  resetTimer(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      seconds : 600
    })
  }

  timeChange(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      seconds : this.allsecond-1
    })
  }

  addMinutes(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      seconds : this.allsecond+60
    })
  }

  subMinutes(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      seconds : this.allsecond-60
    })
  }

  addSeconds(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      seconds : this.allsecond+1
    })
  }

  subSeconds(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      seconds : this.allsecond-1
    })
  }

  start24(){
    this.timer24 = setInterval(()=> {
      this.change24();
    }, 1000)

    this.st24 = !this.st24;
  }

  stop24(){
    clearInterval(this.timer24);

    this.st24 = !this.st24;
  }

  change24(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      timer : this.all24 - 1
    })
  }

  reset24(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      timer : 24
    });
  }

  set14(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      timer : 14
    })
  }

  secAdd(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      timer : this.all24+1
    })
  }

  secSub(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      timer : this.all24-1
    })
  }

  changePos(){

    this.fs.collection('scoreboard').doc('alumni1').update({
      pos: !this.ball_pos
    })
  }

  addPeriod(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      period: this.period+1
    })
  }

  subPeriod(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      period: this.period-1
    })
  }

  homeFoul(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      home_foul: this.home_foul+1
    }).then(() => {
      if(this.home_foul > 4){
        this.guestBonus()
      }
    })
  }

  homeSubFoul(){
    let fouls = this.home_foul - 1;
    if(fouls <= 0){
      this.fs.collection('scoreboard').doc('alumni1').update({
        home_foul: 0
      })
    }else{
      this.fs.collection('scoreboard').doc('alumni1').update({
        home_foul: fouls
      })
    }
   
  }

  guestFoul(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      guest_foul: this.guest_foul+1
    }).then(() => {
      if(this.guest_foul > 4){
        this.homeBonus()
      };
    })
  }

  guestSubFoul(){
    let fouls = this.guest_foul - 1;
    if(fouls <= 0){
      this.fs.collection('scoreboard').doc('alumni1').update({
        guest_foul: 0
      })
    }else{
      this.fs.collection('scoreboard').doc('alumni1').update({
        guest_foul: fouls
      })
    }
    
  }

  homeScore(no:number){
    
    this.fs.collection('scoreboard').doc('alumni1').update({
      home_score: this.home_score + no
    })
  }

  homeSubScore(no:number){
    let newscore = this.home_score - no;
    if(newscore <= 0){
      this.fs.collection('scoreboard').doc('alumni1').update({
        home_score: 0
      })
    }else{
      this.fs.collection('scoreboard').doc('alumni1').update({
        home_score: newscore
      })
    }
    
  }

  guestScore(no:number){
    this.fs.collection('scoreboard').doc('alumni1').update({
      guest_score: this.guest_score + no
    })
  }

  guestSubScore(no:number){
    let newscore = this.guest_score - no;
    if(newscore <= 0){
      this.fs.collection('scoreboard').doc('alumni1').update({
        guest_score: 0
      })
    }else{
      this.fs.collection('scoreboard').doc('alumni1').update({
        guest_score: newscore
      })
    }
  }

  homeBonus(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      home_bonus: true
    })
  }

  guestBonus(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      guest_bonus: true
    })
  }

  resetBonus(){
    this.fs.collection('scoreboard').doc('alumni1').update({
      guest_bonus: false,
      home_bonus: false
    })
  }

}
