import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  err : Boolean = false;
  err2 : Boolean = false;
  admin : Boolean = true;
  
  constructor(private firebaseAuth: AngularFireAuth, private route: Router, private fs: AngularFirestore) { 
    
  }

  changeRole(){
    this.admin = !this.admin
  }

  ngOnInit() {
  }

  submit(loginForm) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(loginForm.value.email, loginForm.value.password)
      .then(value => {
        this.route.navigateByUrl('/admin/home')
        console.log('Nice, it worked!');
      })
      .catch(err => {
        this.err = true;
        console.log('Something went wrong:',err.message);
      });
    
  }

  regSubmit(regForm){
    
    let reg : AngularFirestoreCollection<any>= this.fs.collection('login', ref => ref.where('username', '==', regForm.value.email))
    let register : Observable<any> = reg.valueChanges();

    register.subscribe(x => {
      if(x[0].password == regForm.value.password){
        let id = x[0].team_id;
        window.localStorage.setItem('state', x[0].username);
        this.route.navigateByUrl('/teamreg/' + id);
      } else {
        this.err2 = true;
      }
    })
  }
  
  change(){
    this.route.navigateByUrl('cpd');
  }

}
