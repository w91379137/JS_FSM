import { Component, OnInit } from '@angular/core';
import { TraflicLightFSM, LightStatus } from './traflic-light-fsm';

import { interval } from 'rxjs/internal/observable/interval';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})
export class TrafficLightComponent implements OnInit {

  TLightStatus = LightStatus;
  fsm = new TraflicLightFSM();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  constructor() {
    // this.fsm.StateChange.subscribe(e => {
    //   console.log(e);
    // });
  }

  ngOnInit() {
    // console.log(TraflicLightFSM.AllState);

    const timer = interval(200)
      .pipe(take(60))
      .subscribe(_ => {
        // console.log(this.fsm.State);
        // console.log(this.fsm.ExtendedStates);
        this.fsm.increaseTime();
      });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

}
