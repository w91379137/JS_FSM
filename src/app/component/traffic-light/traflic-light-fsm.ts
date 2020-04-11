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
  protected static AllState = Object.keys(LightStatus)
    .map(key => LightStatus[key])
    .filter(value => !isNaN(Number(value))); // 取出所有狀態

  protected State = LightStatus.Green;

  // Extended states
  protected ExtendedStates = {
    InGreenTime: 0, // 在 綠燈秒數
    InYellowTime: 0, // 在 黃燈秒數
    InRedTime: 0, // 在 紅燈秒數
  };

  // Events
  IncreaseGreenTime() {
    this.ExtendedStates.InGreenTime++;
  }

  IncreaseYellowTime() {
    this.ExtendedStates.InYellowTime++;
  }

  IncreaseRedTime() {
    this.ExtendedStates.InRedTime++;
  }

  // Guard conditions

  // Actions and transitions
}
