import { State, Event, Guard, Notice } from 'src/app/share/fsm-decorator';
import { Subject } from 'rxjs';
import { RoleFSM, RoleStatus } from '../role/role-fsm';
import { random } from 'src/app/share/share-functions';

export enum RoleTeamStatus {
  Idle = 0,
  Ready,
  Work,
  End,
}

const AllRoleTeamStatus = Object.keys(RoleTeamStatus)
  .map(key => RoleTeamStatus[key])
  .filter(value => !isNaN(Number(value)));

export class RoleTeamFSM {

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // State
  @State()
  State = RoleTeamStatus.Idle;

  @Notice()
  StateChange = new Subject<any>();

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Extended states

  /** 名稱 */
  Name = '';

  /** 隊員 */
  teamMenber: RoleFSM[] = [];

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Life Cycle
  constructor(
    name: string = '',
  ) {
    this.Name = name;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Events
  @Event(AllRoleTeamStatus)
  update(): boolean {
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

  // 先檢查是否全死了
  @Guard([RoleTeamStatus.Idle, RoleTeamStatus.Ready, RoleTeamStatus.Work], RoleTeamStatus.End)
  isAllDie(): boolean {
    return !this.teamMenber.find(role => role.State !== RoleStatus.Die);
  }

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
