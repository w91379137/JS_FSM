import { BasicFSMObject } from 'src/app/share/basic-fsm-object';
import { State, Event, Guard } from 'src/app/share/basic-fsm-decorator';
import { Subject } from 'rxjs';

export enum RoleStatus {
  Idle = 0,
  Action,
  Attack,
  Skill,
  Die,
}
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
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event(RoleStatus.Idle)
  addAction(point: number) {
    this.ActionPoint += point;
    return true;
  }

  @Event(RoleStatus.Action)
  startAttack() {
    console.log('startAttack');
    return true;
  }

  @Event(RoleStatus.Attack)
  endAttack() {
    console.log('endAttack');
    return true;
  }

  @Event(RoleStatus.Action)
  startSkill() {
    console.log('startSkill');
    return true;
  }

  @Event(RoleStatus.Skill)
  endSkill() {
    console.log('endSkill');
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(RoleStatus.Idle, RoleStatus.Action)
  isActionPointFull(): boolean {
    return this.ActionPoint >= 100;
  }

  @Guard(RoleStatus.Idle, RoleStatus.Die)
  isDie(): boolean {
    return this.HealthPoint <= 0;
  }
}



