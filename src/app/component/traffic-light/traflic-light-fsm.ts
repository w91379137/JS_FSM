import { BasicFSMObject } from '../../share/basic-fsm-object';
import { Event, Guard, State } from 'src/app/share/basic-fsm-decorator';
import { Subject } from 'rxjs';

enum LightStatus {
  Green = 0,
  Yellow,
  Red,
}

const GreenTime = 10;
const YellowTime = 10;
const RedTime = 10;

export class TraflicLightFSM extends BasicFSMObject {

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  static AllState = Object.keys(LightStatus)
    .map(key => LightStatus[key])
    .filter(value => !isNaN(Number(value))); // 取出所有狀態

  @State()
  State = LightStatus.Green;

  StateChange = new Subject<{ from: LightStatus, to: LightStatus }>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states
  ExtendedStates = {
    InGreenTime: 0, // 在 綠燈秒數
    InYellowTime: 0, // 在 黃燈秒數
    InRedTime: 0, // 在 紅燈秒數
  };

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life
  constructor() {
    super();
    // console.log('EventDictionary', TraflicLightFSM.EventDictionary);
    // console.log('GuardDictionary', TraflicLightFSM.GuardDictionary);
    this.setupClear();
  }

  setupClear() {
    this.StateChange.subscribe(e => {
      switch (e.to) {
        case LightStatus.Green:
          this.ExtendedStates.InGreenTime = 0;
          break;

        case LightStatus.Yellow:
          this.ExtendedStates.InYellowTime = 0;
          break;

        case LightStatus.Red:
          this.ExtendedStates.InRedTime = 0;
          break;
      }
    });
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event([LightStatus.Green, LightStatus.Yellow, LightStatus.Red])
  increaseTime(): boolean {
    switch (this.State) {
      case LightStatus.Green:
        return this.increaseGreenTime();

      case LightStatus.Yellow:
        return this.increaseYellowTime();

      case LightStatus.Red:
        return this.increaseRedTime();
    }
  }

  @Event(LightStatus.Green)
  increaseGreenTime(): boolean {
    this.ExtendedStates.InGreenTime++;
    return true;
  }

  @Event(LightStatus.Yellow)
  increaseYellowTime(): boolean {
    this.ExtendedStates.InYellowTime++;
    return true;
  }

  @Event(LightStatus.Red)
  increaseRedTime(): boolean {
    this.ExtendedStates.InRedTime++;
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions
  @Guard(LightStatus.Green, LightStatus.Yellow)
  isInGreenTimeFull(): boolean {
    return this.ExtendedStates.InGreenTime >= GreenTime;
  }

  @Guard(LightStatus.Yellow, LightStatus.Red)
  isInYellowTimeFull(): boolean {
    return this.ExtendedStates.InYellowTime >= YellowTime;
  }

  @Guard(LightStatus.Red, LightStatus.Green)
  isInRedTimeFull(): boolean {
    return this.ExtendedStates.InRedTime >= RedTime;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Actions and Transitions
}
