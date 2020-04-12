import { Component, OnInit } from '@angular/core';
import { RoleFSM } from 'src/app/component/role/role-fsm';
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
    const idxArr = Array(3).fill(1).map((_, i) => i + 1);
    this.Arena.teamA = idxArr.map(idx => new RoleFSM(`小明${idx}`));
    this.Arena.teamB = idxArr.map(idx => new RoleFSM(`小華${idx}`));
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
