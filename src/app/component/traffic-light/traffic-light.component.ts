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
    // tslint:disable-next-line:no-string-literal
    console.log(TraflicLightFSM['AllState']);

    const timer = interval(1000)
      .pipe(take(100))
      .subscribe(_ => {
        this.fsm.IncreaseGreenTime();
        // tslint:disable-next-line:no-string-literal
        console.log(this.fsm['ExtendedStates']);

      });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

}
