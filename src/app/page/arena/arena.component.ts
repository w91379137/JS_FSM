import { Component, OnInit } from '@angular/core';
import { RoleFSM, RoleStatus } from 'src/app/component/role/role-fsm';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ArenaFSM } from './arena-fsm';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {

  // 競技場
  Arena: ArenaFSM;

  // 小明
  Komei: RoleFSM;

  // 小華
  Xiaohua: RoleFSM;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() {
    this.Arena = new ArenaFSM('Test');
    this.Komei = new RoleFSM('小明');
    this.Xiaohua = new RoleFSM('小華');

    this.Arena.teamA.push(this.Komei);
    this.Arena.teamB.push(this.Xiaohua);
  }

  ngOnInit() {
    const timer = interval(1000)
      // .pipe(take(60))
      .subscribe(_ => {
        // console.log(this.fsm.State);
        // console.log(this.fsm.ExtendedStates);
        this.Arena.check();
      });

    this.Komei.StateChange.subscribe(e => {
      if (e.to === RoleStatus.Ready) {
        const cost = random(30, 50);
        const damage = random(10, 20);
        this.Komei.startWork(cost);
        setTimeout(() => {
          this.Xiaohua.getDamage(damage);
          this.Komei.endWork();
        }, 1000);
      }
    });
    this.Xiaohua.StateChange.subscribe(e => {
      if (e.to === RoleStatus.Ready) {
        const cost = random(30, 50);
        const damage = random(10, 20);
        this.Xiaohua.startWork(cost);
        setTimeout(() => {
          this.Komei.getDamage(damage);
          this.Xiaohua.endWork();
        }, 1000);
      }
    });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
