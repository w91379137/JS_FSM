
import { RoleFSM, RoleStatus } from './role-fsm';
import { prettyPrintFSM } from 'src/app/share/fsm-debug';
// ng test --main ./src/app/component/role/role-fsm.spec.ts

function getRole(state: RoleStatus) {
  const fsm = new RoleFSM();
  fsm.State = state;
  // fsm.StateChange.subscribe(e => {
  //   e.self = Object.assign({}, e.self);
  //   console.log(e);
  // });
  return fsm;
}

// prettyPrintFSM(RoleFSM);

describe(RoleFSM.name, () => {

  it('isActionPointFull', async (done) => {
    const fsm = getRole(RoleStatus.Idle);

    const isDo = fsm.addAction(100);

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleStatus.Ready);
    done();
  });

  it('isStartWork', async (done) => {
    const fsm = getRole(RoleStatus.Ready);

    const isDo = fsm.startWork(100);

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleStatus.Work);
    done();
  });

  it('isEndWork', async (done) => {
    const fsm = getRole(RoleStatus.Work);

    const isDo = fsm.endWork();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(RoleStatus.Idle);
    done();
  });

  it('isDie', async (done) => {
    {
      const fsm = getRole(RoleStatus.Idle);
      fsm.ActionPoint = 0;

      const isDo = fsm.getDamage(100);

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleStatus.Die);
    }

    {
      const fsm = getRole(RoleStatus.Ready);

      const isDo = fsm.getDamage(100);

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleStatus.Die);
    }

    {
      const fsm = getRole(RoleStatus.Work);
      fsm.isWorking = true;

      const isDo = fsm.getDamage(100);

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleStatus.Die);
    }

    done();
  });
});
