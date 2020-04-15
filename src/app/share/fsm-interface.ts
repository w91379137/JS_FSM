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
