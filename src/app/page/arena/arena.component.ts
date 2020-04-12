import { Component, OnInit } from '@angular/core';
import { RoleFSM } from 'src/app/component/role/role-fsm';
import { interval } from 'rxjs';
import { ArenaFSM, ArenaStatus } from './arena-fsm';
import { RoleTeamFSM } from '../../component/role-team/role-team-fsm';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {

  AStatus = ArenaStatus;
  // 競技場
  Arena: ArenaFSM;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() {
    this.Arena = new ArenaFSM('競技場');
    const idxArr = Array(3).fill(1).map((_, i) => i + 1);

    const teamA = new RoleTeamFSM('A');
    teamA.teamMenber = idxArr.map(idx => new RoleFSM(`小明${idx}`));
    this.Arena.teamA = teamA;

    const teamB = new RoleTeamFSM('B');
    teamB.teamMenber = idxArr.map(idx => new RoleFSM(`小華${idx}`));
    this.Arena.teamB = teamB;
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
