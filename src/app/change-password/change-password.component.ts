import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  err;
  success: Boolean = false;

  constructor(private fs: AngularFirestore, private router: Router) {}

  ngOnInit() {}

  change(form) {
    const login: Observable<any> = this.fs.collection('login', ref => ref.where('username', '==', form.value.uname )).snapshotChanges().map((x) => {
      return x.map(y => {
        const key = y.payload.doc.id;
        const data = y.payload.doc.data();

        return {key, data}
      })
    });
    login.subscribe((x) => {
      if (x.length === 0) { this.err = 'Your username cannot be found in the databse, please resubmit'; 
      setTimeout(() => {
        this.err = null;  
      },3000);}
      if (x[0].data.password !== form.value.oldpassword) { 
        this.err = 'Your old password is incorrect, please resubmit'; 
        setTimeout(() => {
        this.err = null; 
      },3000);}
      if (x[0].data.password === form.value.oldpassword) { 
        this.fs.collection('login').doc(x[0].key).update({
          password: form.value.newpassword
        }).then(() => {
          this.success = true;
          setTimeout(() => {
            this.success = false;
            this.router.navigateByUrl('/')
          }, 3000)
        })
      }
    });
  }

}
