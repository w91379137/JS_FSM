
// https://www.cnblogs.com/Wayou/p/typescript_decorator.html
// https://zhongsp.gitbooks.io/typescript-handbook/doc/handbook/Decorators.html

export function checkIn(
  checkInValue: any | any[],
) {
  return function checkFactory(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function newMethod() {
      if (Array.isArray(checkInValue)) {
        if (!checkInValue.includes(this.State)) {
          return false;
        }
      } else {
        if (checkInValue !== this.State) {
          return false;
        }
      }
      return originalMethod.apply(this, arguments);
    };
  };
}
