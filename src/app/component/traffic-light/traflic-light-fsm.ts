import { BasicFSMObject } from '../../share/basic-fsm-object';

enum LightStatus {
  Green = 0,
  Yellow,
  Red,
}

const GreenTime = 10;
const YellowTime = 10;
const RedTime = 10;

export class TraflicLightFSM extends BasicFSMObject {

  // State
  static AllState = Object.keys(LightStatus)
    .map(key => LightStatus[key])
    .filter(value => !isNaN(Number(value))); // 取出所有狀態

  State = LightStatus.Green;

  // Extended states
  ExtendedStates = {
    InGreenTime: 0, // 在 綠燈秒數
    InYellowTime: 0, // 在 黃燈秒數
    InRedTime: 0, // 在 紅燈秒數
  };

  // Events
  increaseTime() {
    switch (this.State) {
      case LightStatus.Green:
        this.increaseGreenTime();
        break;

      case LightStatus.Yellow:
        this.increaseYellowTime();
        break;

      case LightStatus.Red:
        this.increaseRedTime();
        break;
    }
  }

  increaseGreenTime() {
    this.ExtendedStates.InGreenTime++;
    this.checkAll();
  }

  increaseYellowTime() {
    this.ExtendedStates.InYellowTime++;
    this.checkAll();
  }

  increaseRedTime() {
    this.ExtendedStates.InRedTime++;
    this.checkAll();
  }

  // Guard conditions
  isInGreenTimeFull() {
    return this.ExtendedStates.InGreenTime >= GreenTime;
  }

  isInYellowTimeFull() {
    return this.ExtendedStates.InYellowTime >= YellowTime;
  }

  isInRedTimeFull() {
    return this.ExtendedStates.InRedTime >= RedTime;
  }

  checkAll() {
    switch (this.State) {
      case LightStatus.Green:
        if (this.isInGreenTimeFull()) {
          this.ExtendedStates.InYellowTime = 0;
          this.State = LightStatus.Yellow;
        }
        break;

      case LightStatus.Yellow:
        if (this.isInYellowTimeFull()) {
          this.ExtendedStates.InRedTime = 0;
          this.State = LightStatus.Red;
        }
        break;

      case LightStatus.Red:
        if (this.isInRedTimeFull()) {

          this.ExtendedStates.InGreenTime = 0;
          this.State = LightStatus.Green;
        }
        break;
    }
  }

  // Actions and transitions
}
