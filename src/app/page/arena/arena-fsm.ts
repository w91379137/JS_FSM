
import { BasicFSMObject } from 'src/app/share/fsm-object';
import { State, Event, Guard } from 'src/app/share/fsm-decorator';
import { Subject } from 'rxjs';
import { RoleFSM } from 'src/app/component/role/role-fsm';

import { RoleTeamFSM, RoleTeamStatus } from '../../component/role-team/role-team-fsm';
import { random, current } from 'src/app/share/share-functions';

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
  teamA: RoleTeamFSM;

  /** B隊 */
  teamB: RoleTeamFSM;

  get allTeam() {
    return [this.teamA, this.teamB];
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
  update(): boolean {

    for (const roleTeam of this.allTeam) {
      roleTeam.update();
    }

    switch (this.State) {
      case ArenaStatus.Idle:
        for (const roleTeam of this.allTeam) {
          roleTeam.addAction();
        }
        break;

      case ArenaStatus.Work:

        const workTeam = this.allTeam.find(team => team.State === RoleTeamStatus.Work);
        if (workTeam) {
          return false;
        }

        for (const roleTeam of this.allTeam) {
          if (roleTeam.State === RoleTeamStatus.Ready) {

            // 攻擊方
            const AttackRole = roleTeam.getReadyRole();
            if (!AttackRole) {
              return false;
            }

            // 受攻擊方
            let UnderAttackRole: RoleFSM;
            if (roleTeam === this.teamA) {
              UnderAttackRole = this.teamB.getNoDieRole();
            } else {
              UnderAttackRole = this.teamA.getNoDieRole();
            }

            if (!UnderAttackRole) {
              return false;
            }

            const cost = random(30, 50);
            const damage = random(10, 20);

            AttackRole.startWork(cost);
            this.addEventLog(`${AttackRole.Name} 準備攻擊`);
            setTimeout(() => {
              UnderAttackRole.getDamage(damage);
              AttackRole.endWork();
              this.addEventLog(`${AttackRole.Name} 攻擊 ${UnderAttackRole.Name} 造成 ${damage} 傷害`);
              if (UnderAttackRole.HealthPoint <= 0) {
                this.addEventLog(`${UnderAttackRole.Name} 屎掉了`);
              }
            }, 700);
            break;
          }
        }
        break;
    }
    return true;
  }

  // ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
  // Guard conditions

  @Guard(ArenaStatus.Idle, ArenaStatus.Work)
  isAnyTeamWork(): boolean {
    for (const roleTeam of this.allTeam) {
      if (
        roleTeam.State === RoleTeamStatus.Ready ||
        roleTeam.State === RoleTeamStatus.Work
      ) {
        return true;
      }
    }
    return false;
  }

  @Guard(ArenaStatus.Work, ArenaStatus.Idle)
  isAllTeamIdle(): boolean {
    for (const roleTeam of this.allTeam) {
      if (roleTeam.State !== RoleTeamStatus.Idle) {
        return false;
      }
    }
    return true;
  }

  @Guard([ArenaStatus.Idle, ArenaStatus.Work], ArenaStatus.End)
  isAnyTeamEnd(): boolean {
    for (const roleTeam of this.allTeam) {
      if (roleTeam.State === RoleTeamStatus.End) {
        this.addEventLog(`${roleTeam.Name} 全滅了`);
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
    this.eventLog.push(`${current()} > ${msg}`);
  }
}



