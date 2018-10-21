import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reg-team',
  templateUrl: './reg-team.component.html',
  styleUrls: ['./reg-team.component.css']
})
export class RegTeamComponent implements OnInit {

  team_id;

  constructor(private router: Router, private afRouter: ActivatedRoute) {
    this.team_id = afRouter.snapshot.params['id'];
  }

  ngOnInit() {
  }

  logout(){
    window.localStorage.clear()
    this.router.navigateByUrl('/')
  }

  manage(){
    this.router.navigateByUrl('/teamreg/'+this.team_id+'/manage')
  }

}
