import { BasicFSMObject } from 'src/app/share/basic-fsm-object';
import { State, Event, Guard } from 'src/app/share/basic-fsm-decorator';
import { Subject } from 'rxjs';
import { RoleFSM, RoleStatus } from '../role/role-fsm';

export enum RoleTeamStatus {
  Idle = 0,
  Ready,
  Work,
  End,
}

const AllRoleTeamStatus = Object.keys(RoleTeamStatus)
  .map(key => RoleTeamStatus[key])
  .filter(value => !isNaN(Number(value)));

export class RoleTeamFSM extends BasicFSMObject {

  static EventDictionary = {}; // 必須有 不然會共用 super
  static GuardDictionary = {}; // 必須有 不然會共用 super

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  @State()
  State = RoleTeamStatus.Idle;
  StateChange = new Subject<{ from: RoleTeamStatus, to: RoleTeamStatus }>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states

  /** 名稱 */
  Name = '';

  /** 隊員 */
  teamMenber: RoleFSM[] = [];

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
  @Event(AllRoleTeamStatus)
  check(): boolean {
    return true;
  }

  @Event(RoleTeamStatus.Idle)
  addAction() {
    for (const role of this.teamMenber) {
      role.addAction(random(3, 10));
    }
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(RoleTeamStatus.Idle, RoleTeamStatus.Ready)
  isAnyoneReady(): boolean {
    for (const role of this.teamMenber) {
      if (role.State === RoleStatus.Ready) {
        return true;
      }
    }
    return false;
  }

  @Guard(RoleTeamStatus.Ready, RoleTeamStatus.Work)
  isAnyoneWork(): boolean {
    for (const role of this.teamMenber) {
      if (role.State === RoleStatus.Work) {
        return true;
      }
    }
    return false;
  }

  @Guard(RoleTeamStatus.Work, RoleTeamStatus.Idle)
  isFinishWork(): boolean {
    return !this.teamMenber.find(role => role.State === RoleStatus.Work);
  }

  @Guard(RoleTeamStatus.Idle, RoleTeamStatus.End)
  isAllDie(): boolean {
    for (const role of this.teamMenber) {
      if (
        role.State !== RoleStatus.Die
      ) {
        return false;
      }
    }
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // 其他
  getReadyRole() {
    return this.teamMenber.find(role => role.State === RoleStatus.Ready);
  }

  getAliveRole() {
    const aliveRole = this.teamMenber.filter(role => role.HealthPoint > 0);
    return aliveRole[random(0, aliveRole.length)];
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
