
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


@Injectable()
export class AuthService2 implements CanActivate {

    state;
    constructor(private auth: AngularFireAuth, private router: Router) {
        this.state = window.localStorage.getItem('state')
    }

    canActivate()  {
        if(this.state == null){
            this.router.navigate([ '/' ])
            return false;
        }else{
            return true;
        }
    }

}
