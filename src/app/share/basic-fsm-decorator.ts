
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

function oneToArr(obj: any) {
  return Array.isArray(obj) ? obj : [obj];
}

export function State() {
  return function EStateFactory(
    target: any,
    propertyKey: string | symbol,
  ) {

    const val = target[propertyKey];
    const getter = function newGetter() {
      if (this.pState === undefined) {
        this.pState = val;
      }
      return this.pState;
    };
    const setter = function newSetter(next) {
      const old = this.pState;
      this.pState = next;
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

export function Event(
  inState: any | any[],
) {
  return function EventFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Write Table
    const dict = target.constructor.EventDictionary;
    // console.log(target.constructor);
    for (const ele of oneToArr(inState)) {
      const list = dict.hasOwnProperty(ele) ? dict[ele] : [];
      list.push(propertyKey);
      dict[ele] = list;
    }

    // Replace
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      if (!oneToArr(inState).includes(this.State)) {
        return false;
      }

      const result = originalMethod.apply(this, arguments);
      if (result) {
        this.checkAll();
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
    const dict = target.constructor.GuardDictionary;
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
}
