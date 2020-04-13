
import { RoleFSM, RoleStatus } from './role-fsm';
import { prettyPrintObj } from 'src/app/share/share-functions';
// ng test --main ./src/app/component/role/role-fsm.spec.ts

function getRole(state: RoleStatus) {
  const fsm = new RoleFSM();
  fsm.State = state;
  return fsm;
}

describe(RoleFSM.name, () => {

  beforeAll(() => {
    // 用來顯示 Roadmap
    // const testClass = RoleFSM;
    // console.log(testClass.name);
    // console.log(`EventDictionary:${prettyPrintObj(testClass.EventDictionary)}`);
    // console.log(`GuardDictionary:${prettyPrintObj(testClass.GuardDictionary)}`);
  });

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

      const isDo = fsm.getDamage(100);

      expect(isDo).toBe(true);
      expect(fsm.State).toBe(RoleStatus.Die);
    }

    done();
  });
});
