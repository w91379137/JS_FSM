import { Component, OnInit } from '@angular/core';
import { TraflicLightFSM } from './traflic-light-fsm';

import { interval } from 'rxjs/internal/observable/interval';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})
export class TrafficLightComponent implements OnInit {

  fsm = new TraflicLightFSM();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() {

  }

  ngOnInit() {
    console.log(TraflicLightFSM.AllState);

    const timer = interval(100)
      .pipe(take(30))
      .subscribe(_ => {
        console.log(this.fsm.State);
        // console.log(this.fsm.ExtendedStates);
        this.fsm.increaseTime();
      });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

}
