export enum On {
  BeforeEnter = 'BeforeEnter',
  AfterEnter = 'AfterEnter',
  BeforeLeave = 'BeforeLeave',
  AfterLeave = 'AfterLeave',
}

export enum FSMEventType {
  EventAccept = 'EventAccept',
  EventReject = 'EventReject',

  GuardAccept = 'GuardAccept',
  GuardReject = 'GuardReject',

  BeforeTransition = 'BeforeTransition',
  AfterTransition = 'AfterTransition',
}

export interface FSMClass {
  FSMDict: {
    MainState: string,
    Notice: string,
    EventDict: {},
    GuardDict: {},
    ListenList: ListenInfo[],
  };
}

interface ListenInfo {
  on: On;
  state: any;
  funcName: string;
}
