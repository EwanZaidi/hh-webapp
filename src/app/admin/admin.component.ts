import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  err: Boolean = false;

  constructor(private firebaseAuth: AngularFireAuth, private route: Router) { }

  ngOnInit() {
  }

  submit(loginForm) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(loginForm.value.email, loginForm.value.password)
      .then(value => {
        this.route.navigateByUrl('/admin/home')
      })
      .catch(err => {
        this.err = true;
        console.log('Something went wrong:',err.message);
      });
    
  }

}
