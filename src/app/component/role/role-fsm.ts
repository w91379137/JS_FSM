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

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

  @State()
  State = RoleStatus.Idle;
  StateChange = new Subject<{ from: RoleStatus, to: RoleStatus }>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states

  /** 行動值 */
  ActionPoint = 0;

  /** 生命值 */
  HealthPoint = 0;

  /** 魔力值 */
  MagicPoint = 0;

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor() {
    super();
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event(RoleStatus.Idle)
  addActionPoint() {

  }

  @Event(RoleStatus.Action)
  startAttack() {
    console.log('startAttack');
  }

  @Event(RoleStatus.Attack)
  endAttack() {
    console.log('endAttack');
  }

  @Event(RoleStatus.Action)
  startSkill() {
    console.log('startSkill');
  }

  @Event(RoleStatus.Skill)
  endSkill() {
    console.log('endSkill');
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(RoleStatus.Idle, RoleStatus.Action)
  isActionPointFull(): boolean {
    return this.ActionPoint >= 100;
  }

  @Guard(RoleStatus.Idle, RoleStatus.Action)
  isDie(): boolean {
    return this.HealthPoint <= 0;
  }
}



