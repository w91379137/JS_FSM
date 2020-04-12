import { Component, OnInit } from '@angular/core';
import { RoleFSM, RoleStatus } from 'src/app/component/role/role-fsm';
import { interval } from 'rxjs';
import { ArenaFSM } from './arena-fsm';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {

  // 競技場
  Arena: ArenaFSM;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() {
    this.Arena = new ArenaFSM('競技場');
    this.Arena.teamA.push(new RoleFSM('小明'));
    this.Arena.teamB.push(new RoleFSM('小華'));
  }

  ngOnInit() {
    const timer = interval(100)
      // .pipe(take(60))
      .subscribe(_ => {
        // console.log(this.fsm.State);
        // console.log(this.fsm.ExtendedStates);
        this.Arena.check();
      });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
}
