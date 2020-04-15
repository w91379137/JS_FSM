import { State, Notice, Listen, Event, Guard } from 'src/app/share/fsm-decorator';
import { On } from 'src/app/share/fsm-interface';
import { Subject } from 'rxjs';

export enum TestStatus {
  A = 'A',
  B = 'B',
  C = 'C',
}

const AllTestStatus = Object.keys(TestStatus);

export const CountA = 2;
export const CountB = 3;
export const CountC = 4;

export class TestFSM {

  @State()
  SomeSpecialNameState = TestStatus.A;

  @Notice()
  SomeSpecialNameNotice = new Subject<any>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states
  InACount = 0;
  InBCount = 0;
  InCCount = 0;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor() { }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  @Event(AllTestStatus)
  mustDoEvent(): boolean {
    return true;
  }

  @Event(AllTestStatus)
  mustNotDoEvent(): boolean {
    return false;
  }

  @Guard(AllTestStatus, TestStatus.A)
  mustNotDoGuard(): boolean {
    return false;
  }
  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  @Listen(On.BeforeEnter, TestStatus.A)
  clearInACount() {
    this.InACount = 0;
  }

  @Event(TestStatus.A)
  addA(): boolean {
    this.InACount++;
    return true;
  }

  @Guard(TestStatus.A, TestStatus.B)
  isAFull(): boolean {
    return this.InACount >= CountA;
  }
  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  @Listen(On.BeforeEnter, TestStatus.B)
  clearInBCount() {
    this.InBCount = 0;
  }

  @Event(TestStatus.B)
  addB(): boolean {
    this.InBCount++;
    return true;
  }

  @Guard(TestStatus.B, TestStatus.C)
  isBFull(): boolean {
    return this.InBCount >= CountB;
  }
  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  @Listen(On.BeforeEnter, TestStatus.C)
  clearInCCount() {
    this.InCCount = 0;
  }

  @Event(TestStatus.C)
  addC(): boolean {
    this.InCCount++;
    return true;
  }

  @Guard(TestStatus.C, TestStatus.A)
  isCFull(): boolean {
    return this.InCCount >= CountC;
  }
}
