
/*
目前先設計
狀態列表 需要在建立時 就準備好 不能變更

*/

export class BasicFSMObject {

  // State(只能透過 Events 更改)
  protected static AllState: any[] = []; // 給子類自己選擇要哪個 enum
  protected State: any; // 給子類自己選擇要哪個 enum

  // Extended states(只能透過 Events 更改)
  protected ExtendedStates: any = {}; // 其他可以觀察屬性

  // Events(應該要 跟狀態有關 有些可以執行)
  // 表現在哪些狀態 才能執行

  // Guard conditions(應該要 跟狀態有關 有些可以執行)
  // 表現在哪些狀態 才能檢查
  // 表現通過後 匯到哪個 狀態
  // 表現未通過的 原因

  // Actions and transitions
  // 依照事件給予 反應
}
