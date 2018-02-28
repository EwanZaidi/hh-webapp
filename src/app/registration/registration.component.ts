import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  err : Boolean = false;
  
  constructor(private firebaseAuth: AngularFireAuth, private route: Router) { 
    
  }

  ngOnInit() {
  }

  submit(loginForm) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(loginForm.value.email, loginForm.value.password)
      .then(value => {
        this.route.navigateByUrl('/home')
        console.log('Nice, it worked!');
      })
      .catch(err => {
        this.err = true;
        console.log('Something went wrong:',err.message);
      });
    
  }

}
