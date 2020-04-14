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
export class RoleFSM {

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  @State()
  State = RoleStatus.Idle;
  StateChange = new Subject<{ from: RoleStatus, to: RoleStatus }>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states

  /** 名稱 */
  Name = '';

  /** 職業 */
  Job = '';

  /** 行動值 */
  ActionPoint = 100;

  /** 生命值 */
  HealthPoint = 100;

  /** 魔力值 */
  MagicPoint = 100;

  /** 發動攻擊中 */
  isWorking = false;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor(
    name: string = '',
  ) {
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
    this.isWorking = true;
    return true;
  }

  @Event(RoleStatus.Work)
  endWork() {
    this.isWorking = false;
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

  @Guard(RoleStatus.Ready, RoleStatus.Work)
  isStartWork(): boolean {
    return this.isWorking;
  }

  @Guard(RoleStatus.Work, RoleStatus.Idle)
  isEndWork(): boolean {
    return !this.isWorking;
  }

  @Guard([RoleStatus.Idle, RoleStatus.Ready, RoleStatus.Work], RoleStatus.Die)
  isDie(): boolean {
    return this.HealthPoint <= 0;
  }
}



