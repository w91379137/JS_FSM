import { BasicFSMObject } from '../../share/basic-fsm-object';
import { Event, Guard } from 'src/app/share/basic-fsm-decorator';

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

  State = LightStatus.Green;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states
  ExtendedStates = {
    InGreenTime: 0, // 在 綠燈秒數
    InYellowTime: 0, // 在 黃燈秒數
    InRedTime: 0, // 在 紅燈秒數
  };

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
    this.checkAll();
    return true;
  }

  @Event(LightStatus.Yellow)
  increaseYellowTime(): boolean {
    this.ExtendedStates.InYellowTime++;
    this.checkAll();
    return true;
  }

  @Event(LightStatus.Red)
  increaseRedTime(): boolean {
    this.ExtendedStates.InRedTime++;
    this.checkAll();
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions
  @Guard(LightStatus.Green, LightStatus.Yellow)
  isInGreenTimeFull() {
    return this.ExtendedStates.InGreenTime >= GreenTime;
  }

  @Guard(LightStatus.Yellow, LightStatus.Red)
  isInYellowTimeFull() {
    return this.ExtendedStates.InYellowTime >= YellowTime;
  }

  @Guard(LightStatus.Red, LightStatus.Green)
  isInRedTimeFull() {
    return this.ExtendedStates.InRedTime >= RedTime;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  checkAll() {
    switch (this.State) {
      case LightStatus.Green:
        this.isInGreenTimeFull();
        break;

      case LightStatus.Yellow:
        this.isInYellowTimeFull();
        break;

      case LightStatus.Red:
        this.isInRedTimeFull();
        break;
    }
  }

  // Actions and transitions
}
