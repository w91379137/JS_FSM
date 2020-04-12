import { Component, OnInit, Input } from '@angular/core';
import { RoleTeamFSM, RoleTeamStatus } from './role-team-fsm';

@Component({
  selector: 'app-role-team',
  templateUrl: './role-team.component.html',
  styleUrls: ['./role-team.component.scss']
})
export class RoleTeamComponent implements OnInit {

  RTStatus = RoleTeamStatus;

  @Input()
  roleTeam: RoleTeamFSM;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() { }

  ngOnInit() {

  }

}
