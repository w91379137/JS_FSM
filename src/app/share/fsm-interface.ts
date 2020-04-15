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
    EventList: EventInfo[],
    GuardDict: {},
    ListenList: ListenInfo[],
  };
}

interface EventInfo {
  state: any;
  funcName: string;
}

interface ListenInfo {
  on: On;
  state: any;
  funcName: string;
}
