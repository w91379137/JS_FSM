import { Component, OnInit } from '@angular/core';
import { TraflicLightFSM } from './traflic-light-fsm';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})
export class TrafficLightComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // tslint:disable-next-line:no-string-literal
    console.log(TraflicLightFSM['AllState']);
  }

}
