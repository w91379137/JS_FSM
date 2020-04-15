
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

import { oneToArr } from './share-functions';
import { FSMEventType, On, FSMClass, getDefaultFSMDict } from './fsm-interface';

function classCheck(aClass: any) {
  // 目前就依照 不同 Decorator 依照陣列 擺放
  aClass.FSMDict = aClass.FSMDict || getDefaultFSMDict();
  return aClass as FSMClass;
}

function sendNotice(type: FSMEventType, funcName: string = '', arg: any[] = []) {
  const subject = this[this.constructor.FSMDict.Notice];
  if (!(subject && subject.next)) {
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

  const selfClass = classCheck(this.constructor);
  const guardList = selfClass.FSMDict.GuardList;
  const state = this[selfClass.FSMDict.MainState];
  guardList
    .filter(ele => ele.from.includes(state))
    .reduce(
      (isStop, guardInfo) => {
        if (isStop) {
          return isStop;
        }

        const func = this[guardInfo.funcName];
        if (!func) {
          console.log('No func for name', this, guardInfo); // 不應該
          return isStop;
        }

        // 目前不考慮 檢查是否有多個 符合一個符合就停止
        return func.apply(this);
      },
      false
    );
}

function doTransition(toState) {
  this.sendNotice(FSMEventType.BeforeTransition);
  const fromState = this[this.constructor.FSMDict.MainState];

  const listenList = classCheck(this.constructor).FSMDict.ListenList;

  listenList.filter(ele =>
    ((ele.on === On.BeforeLeave) && ele.state.includes(fromState)) ||
    ((ele.on === On.BeforeEnter) && ele.state.includes(toState))
  ).forEach(ele => this[ele.funcName].apply(this));

  this[this.constructor.FSMDict.MainState] = toState;

  listenList.filter(ele =>
    ((ele.on === On.AfterLeave) && ele.state.includes(fromState)) ||
    ((ele.on === On.AfterEnter) && ele.state.includes(toState))
  ).forEach(ele => this[ele.funcName].apply(this));

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
  return function StateFactory(
    target: any,
    propertyKey: string,
  ) {
    classCheck(target.constructor).FSMDict.MainState = propertyKey;
  };
}

export function Notice() {
  return function NoticeFactory(
    target: any,
    propertyKey: string,
  ) {
    classCheck(target.constructor).FSMDict.Notice = propertyKey;
  };
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// Method Decorator

export function Event(
  state: any | any[],
) {
  return function EventFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const states = oneToArr(state);

    // Write Table
    const selfClass = classCheck(target.constructor);
    selfClass.FSMDict.EventList.push({
      state: states,
      funcName: propertyKey,
    });

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      instanceCheck(this);

      let isAccept = true;
      isAccept = isAccept && states.includes(this[selfClass.FSMDict.MainState]);
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
  from: any | any[],
  to: any,
) {
  return function GuardFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const states = oneToArr(from);

    // Write Table
    const selfClass = classCheck(target.constructor);
    selfClass.FSMDict.GuardList.push({
      from: states,
      to,
      funcName: propertyKey,
    });

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {

      let isAccept = true;

      isAccept = isAccept && states.includes(this[selfClass.FSMDict.MainState]);
      if (!isAccept) {
        // not in states no sendNotice
        return isAccept;
      }

      isAccept = isAccept && originalMethod.apply(this, arguments);

      if (isAccept) {
        this.sendNotice(FSMEventType.GuardAccept, propertyKey, Array.from(arguments));
        this.doTransition(to);
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
    const states = oneToArr(state);

    // Write Table
    const selfClass = classCheck(target.constructor);
    selfClass.FSMDict.ListenList.push({
      on,
      state: states,
      funcName: propertyKey,
    });
  };
}
