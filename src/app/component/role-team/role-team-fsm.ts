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
    return !!this.teamMenber.find(role => role.State === RoleStatus.Ready);
  }

  @Guard(RoleTeamStatus.Ready, RoleTeamStatus.Work)
  isAnyoneWork(): boolean {
    return !!this.teamMenber.find(role => role.State === RoleStatus.Work);
  }

  @Guard(RoleTeamStatus.Ready, RoleTeamStatus.Idle)
  isNobodyReady(): boolean {
    return !this.teamMenber.find(role => role.State === RoleStatus.Ready);
  }

  @Guard(RoleTeamStatus.Work, RoleTeamStatus.Idle)
  isNobodyWork(): boolean {
    return !this.teamMenber.find(role => role.State === RoleStatus.Work);
  }

  @Guard([RoleTeamStatus.Idle, RoleTeamStatus.Ready, RoleTeamStatus.Work], RoleTeamStatus.End)
  isAllDie(): boolean {
    return !this.teamMenber.find(role => role.State !== RoleStatus.Die);
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // 其他
  getReadyRole() {
    const roles = this.teamMenber.filter(role => role.State === RoleStatus.Ready);
    return roles[random(0, roles.length)];
  }

  getNoDieRole() {
    const roles = this.teamMenber.filter(role => role.State !== RoleStatus.Die);
    return roles[random(0, roles.length)];
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
