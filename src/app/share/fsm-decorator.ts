
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

import { prettyPrintObj, oneToArr } from './share-functions';

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

export function prettyPrintFSM(aClass: any) {
  console.log(aClass.name);
  console.log(`FSMDict:${prettyPrintObj(aClass.FSMDict)}`);
}

function classCheck(aClass: any) {
  // 目前就依照 不同 Decorator 依照陣列 擺放
  aClass.FSMDict = aClass.FSMDict || {
    MainState: '',
    Notice: '',
    EventDict: {},
    GuardDict: {},
    Listen: {},
  };
  return aClass;
}

function sendNotice(type: FSMEventType, funcName: string = '', arg: any[] = []) {
  const subject = this[this.constructor.FSMDict.Notice];
  if (!subject || !subject.next) {
    return;
  }
  subject.next({
    self: this,
    type,
    funcName,
    arg,
  });
}

function checkGuards() {
  const funcDataList =
    this.constructor.FSMDict.GuardDict[this.State] || [];

  for (const funcData of funcDataList) {
    const func = this[funcData.funcName];
    if (func) {
      // 目前不考慮 檢查是否有多個 符合一個符合就停止
      const isAccept = func.apply(this);
      if (isAccept) {
        break;
      }
    } else {
      console.log(this, funcData);
    }
  }
}

interface ListenObj {
  on: On;
  state: any;
  funcName: string;
}

function doTransition(toState) {
  this.sendNotice(FSMEventType.BeforeTransition);
  const fromState = this[this.constructor.FSMDict.MainState];

  const fromListen = (this.constructor.FSMDict.Listen[fromState] || []) as ListenObj[];
  const toListen = (this.constructor.FSMDict.Listen[toState] || []) as ListenObj[];

  fromListen
    .filter(ele => (ele.state === fromState) && (ele.on === On.BeforeLeave))
    .forEach(ele => this[ele.funcName].apply(this));

  toListen
    .filter(ele => (ele.state === toState) && (ele.on === On.BeforeEnter))
    .forEach(ele => this[ele.funcName].apply(this));

  this[this.constructor.FSMDict.MainState] = toState;

  fromListen
    .filter(ele => (ele.state === fromState) && (ele.on === On.AfterLeave))
    .forEach(ele => this[ele.funcName].apply(this));

  toListen
    .filter(ele => (ele.state === toState) && (ele.on === On.AfterEnter))
    .forEach(ele => this[ele.funcName].apply(this));

  this.sendNotice(FSMEventType.AfterTransition);
}

function instanceCheck(aInstance: any) {
  aInstance.sendNotice = aInstance.sendNotice || sendNotice;
  aInstance.checkGuards = aInstance.checkGuards || checkGuards;
  aInstance.doTransition = aInstance.doTransition || doTransition;
  return aInstance;
}

// https://www.typescriptlang.org/docs/handbook/decorators.html
// 啟動順序
// Method Decorator > instance
// Property Decorator > instance
// Method Decorator > static
// Property Decorator > static
// Class Decorator

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// Property Decorator

export function State() {
  return function EStateFactory(
    target: any,
    propertyKey: string | symbol,
  ) {
    classCheck(target.constructor).FSMDict.MainState = propertyKey;
  };
}

export function Notice() {
  return function EStateFactory(
    target: any,
    propertyKey: string | symbol,
  ) {
    classCheck(target.constructor).FSMDict.Notice = propertyKey;
  };
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// Method Decorator

export function Event(
  inState: any | any[],
) {
  return function EventFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Write Table
    const selfClass = classCheck(target.constructor);
    const dict = selfClass.FSMDict.EventDict;
    // console.log(target.constructor);
    for (const ele of oneToArr(inState)) {
      const list = dict.hasOwnProperty(ele) ? dict[ele] : [];
      list.push(propertyKey);
      dict[ele] = list;
    }

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      instanceCheck(this);

      let isAccept = true;
      isAccept = isAccept && oneToArr(inState).includes(this[selfClass.FSMDict.MainState]);
      isAccept = isAccept && originalMethod.apply(this, arguments);

      if (isAccept) {
        this.sendNotice(FSMEventType.EventAccept, propertyKey, Array.from(arguments));
        this.checkGuards();
      } else {
        this.sendNotice(FSMEventType.EventReject, propertyKey, Array.from(arguments));
      }

      return isAccept;
    };
  };
}

export function Guard(
  fromState: any | any[],
  toState: any,
) {
  return function GuardFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Write Table
    const selfClass = classCheck(target.constructor);
    const dict = selfClass.FSMDict.GuardDict;
    // console.log(target.constructor);
    for (const ele of oneToArr(fromState)) {
      const list = dict.hasOwnProperty(ele) ? dict[ele] : [];
      list.push({
        to: toState,
        funcName: propertyKey,
      });
      dict[ele] = list;
    }

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {

      let isAccept = true;

      // checkGuards 有挑選過 所這個條件 通常是成立的 如果有人直接呼叫 就會從這邊回絕
      isAccept = isAccept && oneToArr(fromState).includes(this[selfClass.FSMDict.MainState]);
      isAccept = isAccept && originalMethod.apply(this, arguments);

      if (isAccept) {
        this.sendNotice(FSMEventType.GuardAccept, propertyKey, Array.from(arguments));
        this.doTransition(toState);
      } else {
        this.sendNotice(FSMEventType.GuardReject, propertyKey, Array.from(arguments));
      }

      return isAccept;
    };
  };
}

export function Listen(
  on: On,
  state: any | any[],
) {
  return function ListenFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Write Table
    const selfClass = classCheck(target.constructor);
    const dict = selfClass.FSMDict.Listen;
    for (const ele of oneToArr(state)) {
      const list = dict.hasOwnProperty(ele) ? dict[ele] : [];
      list.push({
        on,
        state,
        funcName: propertyKey,
      });
      dict[ele] = list;
    }
  };
}
