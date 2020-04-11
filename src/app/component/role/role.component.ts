import { Component, OnInit, Input } from '@angular/core';
import { RoleFSM, RoleStatus } from './role-fsm';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  RStatus = RoleStatus;

  @Input()
  role: RoleFSM;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  constructor() {

  }

  ngOnInit() {

  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
}
