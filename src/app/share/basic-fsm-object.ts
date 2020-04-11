
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

  // Events
  // Guard conditions
  // Actions and transitions
}
