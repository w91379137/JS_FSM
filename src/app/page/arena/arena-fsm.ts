
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

  eventLog: string[] = [];

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
  check(): boolean {

    switch (this.State) {
      case ArenaStatus.Idle:
        for (const role of this.allRole) {
          role.addAction(random(3, 10));
        }
        break;

      case ArenaStatus.Work:
        for (const role of this.allRole) {
          if (role.State === RoleStatus.Ready) {

            // 找到對手
            let UnderAttackRole: RoleFSM;
            if (this.teamA.includes(role)) {
              UnderAttackRole = this.teamB[0];
            } else {
              UnderAttackRole = this.teamA[0];
            }

            if (!UnderAttackRole) {
              return false;
            }

            const cost = random(30, 50);
            const damage = random(10, 20);

            role.startWork(cost);
            this.addEventLog(`${role.Name} 準備攻擊`);
            setTimeout(() => {
              UnderAttackRole.getDamage(damage);
              role.endWork();
              this.addEventLog(`${role.Name} 攻擊 ${UnderAttackRole.Name} 造成 ${damage} 傷害`);
            }, 1000);
          }
        }
        break;
    }
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(ArenaStatus.Idle, ArenaStatus.Work)
  isAnyoneReady(): boolean {
    for (const role of this.allRole) {
      if (role.State === RoleStatus.Ready) {
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

  @Guard([ArenaStatus.Idle, ArenaStatus.Work], ArenaStatus.End)
  isAnyoneDie(): boolean {
    for (const role of this.allRole) {
      if (role.State === RoleStatus.Die) {
        this.addEventLog(`${role.Name} 屎掉了`);
        return true;
      }
    }
    return false;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // 其他
  addEventLog(msg: string) {
    if (this.eventLog.length > 10) {
      this.eventLog.shift();
    }
    this.eventLog.push(`${new Date()}> ${msg}`);
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
