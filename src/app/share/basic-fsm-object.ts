
import { Subject } from 'rxjs';

/*
目前先設計
狀態列表 需要在建立時 就準備好 不能變更
*/

export class BasicFSMObject {

  // State(只能透過 Events 更改)
  // static AllState: any[] = []; // 給子類自己選擇要哪個 enum
  static EventDictionary = {};
  static GuardDictionary = {};

  State: any; // 給子類自己選擇要哪個 enum
  StateChange = new Subject<{ from: any, to: any }>();

  // Extended states(只能透過 Events 更改)
  // 其他可以觀察屬性

  // Events
  // v 哪種狀態能執行
  // v 執行之後自動檢查

  // Guard conditions
  // v 哪種狀態能檢查
  // v 通過後到哪個狀態
  // x log未通過的原因

  checkAll() {
    // tslint:disable-next-line:no-string-literal
    const funcNameList = this.constructor['GuardDictionary'][this.State];
    for (const funcName of funcNameList) {
      const func = this[funcName];
      if (func) {
        func.apply(this);
      } else {
        console.log(this, funcName);
      }
    }
  }

  // Actions and Transitions
  // 依照事件給予 反應
}
