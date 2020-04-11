
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

function oneToArr(obj: any) {
  return Array.isArray(obj) ? obj : [obj];
}

export function Event(
  checkInValue: any | any[],
) {
  return function EventFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      if (!oneToArr(checkInValue).includes(this.State)) {
        return false;
      }
      return originalMethod.apply(this, arguments);
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
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      if (!oneToArr(from).includes(this.State)) {
        return false;
      }
      const result = originalMethod.apply(this, arguments);
      if (result) {
        this.State = to;
      }
      return result;
    };
  };
}
