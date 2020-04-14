
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

function oneToArr(obj: any) {
  return Array.isArray(obj) ? obj : [obj];
}

function classCheck(aClass: any) {
  // 目前就依照 不同 Decorator 依照陣列 擺放
  aClass.FSMDict = aClass.FSMDict || {
    EventDict: {},
    GuardDict: {},
  };
}

function checkGuards() {
  const funcDataList =
    this.constructor.FSMDict.GuardDict[this.State] || [];

  for (const funcData of funcDataList) {
    const func = this[funcData.FuncName];
    if (func) {
      func.apply(this);
    } else {
      console.log(this, funcData);
    }
  }
}

function instanceCheck(aInstance: any) {
  aInstance.checkGuards = aInstance.checkGuards || checkGuards;
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

    const val = target[propertyKey];
    const getter = function newGetter() {
      if (this.privateState === undefined) {
        this.privateState = val;
      }
      return this.privateState;
    };
    const setter = function newSetter(next) {
      const old = this.privateState;
      this.privateState = next;
      this.StateChange.next({ from: old, to: next });
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
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
    const selfClass = target.constructor;
    classCheck(selfClass);
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
      if (!oneToArr(inState).includes(this.State)) {
        return false;
      }

      const result = originalMethod.apply(this, arguments);
      if (result) {
        this.checkGuards();
      }

      return result;
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
    const selfClass = target.constructor;
    classCheck(selfClass);
    const dict = selfClass.FSMDict.GuardDict;
    // console.log(target.constructor);
    for (const ele of oneToArr(fromState)) {
      const list = dict.hasOwnProperty(ele) ? dict[ele] : [];
      list.push({
        to: toState,
        FuncName: propertyKey,
      });
      dict[ele] = list;
    }

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      if (!oneToArr(fromState).includes(this.State)) {
        return false;
      }
      const result = originalMethod.apply(this, arguments);
      if (result) {
        this.State = toState;
      }
      return result;
    };
  };

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Method Decorator

  // export function BeforeEnter(
  //   state: any | any[],
  // ) {
  // };

  // export function AfterEnter(
  //   state: any | any[],
  // ) {
  // };

  // export function BeforeLeave(
  //   state: any | any[],
  // ) {
  // };

  // export function AfterLeave(
  //   state: any | any[],
  // ) {
  // };

  // 把要用的表 集合到一個屬性
}
