
import { BasicFSMObject } from 'src/app/share/basic-fsm-object';
import { State, Event, Guard } from 'src/app/share/basic-fsm-decorator';
import { Subject } from 'rxjs';
import { RoleFSM, RoleStatus } from 'src/app/component/role/role-fsm';

export enum ArenaStatus {
  Idle = 0,
  Work,
  End,
}

const AllArenaStatus = Object.keys(ArenaStatus)
  .map(key => ArenaStatus[key])
  .filter(value => !isNaN(Number(value)));

export class ArenaFSM extends BasicFSMObject {

  static EventDictionary = {}; // 必須有 不然會共用 super
  static GuardDictionary = {}; // 必須有 不然會共用 super

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  @State()
  State = ArenaStatus.Idle;
  StateChange = new Subject<{ from: ArenaStatus, to: ArenaStatus }>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states

  /** 名稱 */
  Name = '';

  /** A隊 */
  teamA: RoleFSM[] = [];

  /** B隊 */
  teamB: RoleFSM[] = [];

  get allRole() {
    return this.teamA.concat(this.teamB);
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor(
    name: string,
  ) {
    super();
    this.Name = name;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event(AllArenaStatus)
  check() {

    switch (this.State) {
      case ArenaStatus.Idle:
        for (const role of this.allRole) {
          role.addAction(random(3, 5));
        }
        break;
    }
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(ArenaStatus.Idle, ArenaStatus.Work)
  isAnyoneWork(): boolean {
    for (const role of this.allRole) {
      if (role.State !== RoleStatus.Idle) {
        return true;
      }
    }
    return false;
  }

  @Guard(ArenaStatus.Work, ArenaStatus.Idle)
  isAllIdle(): boolean {
    for (const role of this.allRole) {
      if (role.State !== RoleStatus.Idle) {
        return false;
      }
    }
    return true;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
