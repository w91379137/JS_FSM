
import { State, Event, Guard, Notice, Listen, On } from 'src/app/share/basic-fsm-decorator';
import { Subject } from 'rxjs';

export enum LightStatus {
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red',
}

const AllLightStatus = Object.keys(LightStatus);

const GreenTime = 10;
const YellowTime = 10;
const RedTime = 10;

export class TraflicLightFSM {

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  // static AllState = Object.keys(LightStatus)
  //   .map(key => LightStatus[key])
  //   .filter(value => !isNaN(Number(value))); // 取出所有狀態

  @State()
  State = LightStatus.Green;

  @Notice()
  Notice = new Subject<any>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states
  InGreenTime = 0; // 在 綠燈秒數
  InYellowTime = 0; // 在 黃燈秒數
  InRedTime = 0; // 在 紅燈秒數

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor() {
    // tslint:disable-next-line:no-string-literal
    console.log(TraflicLightFSM['FSMDict']);
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event(AllLightStatus)
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

  @Listen(On.BeforeEnter, LightStatus.Green)
  clearInGreenTime() {
    this.InGreenTime = 0;
  }

  @Event(LightStatus.Green)
  increaseGreenTime(): boolean {
    this.InGreenTime++;
    return true;
  }

  @Listen(On.BeforeEnter, LightStatus.Yellow)
  clearInYellowTime() {
    this.InYellowTime = 0;
  }

  @Event(LightStatus.Yellow)
  increaseYellowTime(): boolean {
    this.InYellowTime++;
    return true;
  }

  @Listen(On.BeforeEnter, LightStatus.Red)
  clearInRedTime() {
    this.InRedTime = 0;
  }

  @Event(LightStatus.Red)
  increaseRedTime(): boolean {
    this.InRedTime++;
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions
  @Guard(LightStatus.Green, LightStatus.Yellow)
  isInGreenTimeFull(): boolean {
    return this.InGreenTime >= GreenTime;
  }

  @Guard(LightStatus.Yellow, LightStatus.Red)
  isInYellowTimeFull(): boolean {
    return this.InYellowTime >= YellowTime;
  }

  @Guard(LightStatus.Red, LightStatus.Green)
  isInRedTimeFull(): boolean {
    return this.InRedTime >= RedTime;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Actions and Transitions
}
