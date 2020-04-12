import { BasicFSMObject } from 'src/app/share/basic-fsm-object';
import { State, Event, Guard } from 'src/app/share/basic-fsm-decorator';
import { Subject } from 'rxjs';

export enum RoleStatus {
  Idle = 0,
  Ready,
  Work,
  Die,
}

const AllRoleStatus = Object.keys(RoleStatus)
  .map(key => RoleStatus[key])
  .filter(value => !isNaN(Number(value)));
export class RoleFSM extends BasicFSMObject {

  static EventDictionary = {}; // 必須有 不然會共用 super
  static GuardDictionary = {}; // 必須有 不然會共用 super

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  @State()
  State = RoleStatus.Idle;
  StateChange = new Subject<{ from: RoleStatus, to: RoleStatus }>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states

  /** 名稱 */
  Name = '';

  // 職業

  /** 行動值 */
  ActionPoint = 100;

  /** 生命值 */
  HealthPoint = 100;

  /** 魔力值 */
  MagicPoint = 100;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor(
    name: string,
  ) {
    super();
    this.Name = name;
    // console.log(AllRoleStatus);
    // console.log(RoleFSM.GuardDictionary);
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event(RoleStatus.Idle)
  addAction(point: number) {
    this.ActionPoint = Math.min(this.ActionPoint + point, 100);
    return true;
  }

  @Event(RoleStatus.Ready)
  startWork(cost: number) {
    this.ActionPoint -= cost;
    this.State = RoleStatus.Work;
    return true;
  }

  @Event(RoleStatus.Work)
  endWork() {
    this.State = RoleStatus.Idle;
    return true;
  }

  @Event(AllRoleStatus)
  getDamage(point: number) {
    this.HealthPoint = Math.max(this.HealthPoint - point, 0);
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(RoleStatus.Idle, RoleStatus.Ready)
  isActionPointFull(): boolean {
    return this.ActionPoint >= 100;
  }

  @Guard(RoleStatus.Idle, RoleStatus.Die)
  isDie(): boolean {
    return this.HealthPoint <= 0;
  }
}



