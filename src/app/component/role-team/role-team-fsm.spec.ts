import { RoleTeamFSM, RoleTeamStatus } from './role-team-fsm';
import { RoleStatus, RoleFSM } from '../role/role-fsm';
import { prettyPrintFSM } from 'src/app/share/fsm-debug';
// ng test --main ./src/app/component/role-team/role-team-fsm.spec.ts

// prettyPrintFSM(RoleTeamFSM);

function getRoleTeam(state: RoleTeamStatus) {
  const fsm = new RoleTeamFSM();
  fsm.teamMenber = [new RoleFSM(), new RoleFSM()];
  fsm.State = state;
  // fsm.StateChange.subscribe(e => {
  //   e.self = Object.assign({}, e.self);
  //   console.log(e);
  // });

  return fsm;
}

describe(RoleTeamFSM.name, () => {

  it('isAnyoneReady', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Idle);

    const menber = fsm.teamMenber[0];
    // spyOnProperty(menber, 'State').and.returnValue(RoleStatus.Ready); //改不動
    Object.defineProperty(menber, 'State', { get: () => RoleStatus.Ready });
    const isDo = fsm.update();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Ready);
    done();
  });

  it('isAnyoneWork', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Ready);

    const menber = fsm.teamMenber[0];
    // spyOnProperty(fsm.teamMenber[0], 'State', 'get').and.returnValue(RoleStatus.Work); //改不動
    Object.defineProperty(menber, 'State', { get: () => RoleStatus.Work });
    const isDo = fsm.update();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Work);
    done();
  });

  it('isNobodyReady', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Ready);

    const isDo = fsm.update();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Idle);
    done();
  });

  it('isNobodyWork', async (done) => {
    const fsm = getRoleTeam(RoleTeamStatus.Work);

    const isDo = fsm.update();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleTeamStatus.Idle);
    done();
  });

  it('isAllDie', async (done) => {
    {
      const fsm = getRoleTeam(RoleTeamStatus.Idle);

      fsm.teamMenber.forEach(role => {
        // spyOnProperty(role, 'State', 'get').and.returnValue(RoleStatus.Die);
        Object.defineProperty(role, 'State', { get: () => RoleStatus.Die });
      });

      const isDo = fsm.update();

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleTeamStatus.End);
    }

    {
      const fsm = getRoleTeam(RoleTeamStatus.Ready);

      fsm.teamMenber.forEach(role => {
        // spyOnProperty(role, 'State', 'get').and.returnValue(RoleStatus.Die);
        Object.defineProperty(role, 'State', { get: () => RoleStatus.Die });
      });
      const isDo = fsm.update();

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleTeamStatus.End);
    }

    {
      const fsm = getRoleTeam(RoleTeamStatus.Work);

      fsm.teamMenber.forEach(role => {
        // spyOnProperty(role, 'State', 'get').and.returnValue(RoleStatus.Die);
        Object.defineProperty(role, 'State', { get: () => RoleStatus.Die });
      });
      const isDo = fsm.update();

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleTeamStatus.End);
    }

    done();
  });
});
