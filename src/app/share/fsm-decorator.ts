
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

import { oneToArr } from './share-functions';
import { FSMEventType, On, FSMClass, DefaultFSMDict } from './fsm-interface';

function classCheck(aClass: any) {
  // 目前就依照 不同 Decorator 依照陣列 擺放
  aClass.FSMDict = aClass.FSMDict || DefaultFSMDict;
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

  const guardList = classCheck(this.constructor).FSMDict.GuardList;

  for (const guardInfo of guardList) {
    const func = this[guardInfo.funcName];
    if (func) {
      // 目前不考慮 檢查是否有多個 符合一個符合就停止
      const isAccept = func.apply(this);
      if (isAccept) {
        break;
      }
    } else {
      console.log(this, guardInfo);
    }
  }
}

function doTransition(toState) {
  this.sendNotice(FSMEventType.BeforeTransition);
  const fromState = this[this.constructor.FSMDict.MainState];

  const listenList = classCheck(this.constructor).FSMDict.ListenList;

  listenList.filter(ele =>
    ((ele.on === On.BeforeLeave) && (ele.state === fromState)) ||
    ((ele.on === On.BeforeEnter) && (ele.state === toState))
  ).forEach(ele => this[ele.funcName].apply(this));

  this[this.constructor.FSMDict.MainState] = toState;

  listenList.filter(ele =>
    ((ele.on === On.AfterLeave) && (ele.state === fromState)) ||
    ((ele.on === On.AfterEnter) && (ele.state === toState))
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
    // Write Table
    const selfClass = classCheck(target.constructor);
    const list = selfClass.FSMDict.EventList;

    oneToArr(state).forEach(ele => {
      list.push({
        state: ele,
        funcName: propertyKey,
      });
    });

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      instanceCheck(this);

      let isAccept = true;
      isAccept = isAccept && oneToArr(state).includes(this[selfClass.FSMDict.MainState]);
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
    // Write Table
    const selfClass = classCheck(target.constructor);
    const list = selfClass.FSMDict.GuardList;

    oneToArr(from).forEach(ele => {
      list.push({
        from: ele,
        to,
        funcName: propertyKey,
      });
    });

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {

      let isAccept = true;

      isAccept = isAccept && oneToArr(from).includes(this[selfClass.FSMDict.MainState]);
      if (!isAccept) {
        // 狀態不合 不用 sendNotice
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
    // Write Table
    const selfClass = classCheck(target.constructor);
    const list = selfClass.FSMDict.ListenList;
    oneToArr(state).forEach(ele => {
      list.push({
        on,
        state: ele,
        funcName: propertyKey,
      });
    });
  };
}
