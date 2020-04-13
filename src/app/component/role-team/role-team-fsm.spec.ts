import { RoleTeamFSM, RoleTeamStatus } from './role-team-fsm';
import { prettyPrintObj } from 'src/app/share/share-functions';
import { RoleStatus, RoleFSM } from '../role/role-fsm';
// ng test --main ./src/app/component/role-team/role-team-fsm.spec.ts

function getRoleTeam(state: RoleTeamStatus) {
  const fsm = new RoleTeamFSM();
  fsm.teamMenber = [new RoleFSM(), new RoleFSM()];
  fsm.State = state;
  return fsm;
}

describe(RoleTeamFSM.name, () => {

  beforeAll(() => {
    // 用來顯示 Roadmap
    // const testClass = RoleTeamFSM;
    // console.log(testClass.name);
    // console.log(`EventDictionary:${prettyPrintObj(testClass.EventDictionary)}`);
    // console.log(`GuardDictionary:${prettyPrintObj(testClass.GuardDictionary)}`);
  });

  it('isAnyoneReady', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Idle);

    spyOnProperty(fsm.teamMenber[0], 'State', 'get').and.returnValue(RoleStatus.Ready);
    const isDo = fsm.check();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Ready);
    done();
  });

  it('isAnyoneWork', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Ready);

    spyOnProperty(fsm.teamMenber[0], 'State', 'get').and.returnValue(RoleStatus.Work);
    const isDo = fsm.check();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Work);
    done();
  });

  it('isNobodyReady', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Ready);

    const isDo = fsm.check();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Idle);
    done();
  });

  it('isNobodyWork', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Work);

    const isDo = fsm.check();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Idle);
    done();
  });

  it('isAllDie', async (done) => {
    {
      const fsm = getRoleTeam(RoleTeamStatus.Idle);

      fsm.teamMenber.forEach(role => {
        spyOnProperty(role, 'State', 'get').and.returnValue(RoleStatus.Die);
      });

      const isDo = fsm.check();

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleTeamStatus.End);
    }

    {
      const fsm = getRoleTeam(RoleTeamStatus.Ready);

      fsm.teamMenber.forEach(role => {
        spyOnProperty(role, 'State', 'get').and.returnValue(RoleStatus.Die);
      });
      const isDo = fsm.check();

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleTeamStatus.End);
    }

    {
      const fsm = getRoleTeam(RoleTeamStatus.Work);

      fsm.teamMenber.forEach(role => {
        spyOnProperty(role, 'State', 'get').and.returnValue(RoleStatus.Die);
      });
      const isDo = fsm.check();

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleTeamStatus.End);
    }

    done();
  });
});
