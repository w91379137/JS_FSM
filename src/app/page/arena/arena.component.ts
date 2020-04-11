import { Component, OnInit } from '@angular/core';
import { RoleFSM } from 'src/app/component/role/role-fsm';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {

  // 小明
  Komei: RoleFSM;

  // 小華
  Xiaohua: RoleFSM;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() {
    this.Komei = new RoleFSM('小明');
    this.Xiaohua = new RoleFSM('小華');
  }

  ngOnInit() {
    const timer = interval(1000)
      // .pipe(take(60))
      .subscribe(_ => {
        // console.log(this.fsm.State);
        // console.log(this.fsm.ExtendedStates);
        this.Komei.addAction(random(3, 5));
        this.Xiaohua.addAction(random(3, 5));
      });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
