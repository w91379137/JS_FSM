import { prettyPrintFSM } from 'src/app/share/fsm-debug';
import { TraflicLightFSM } from './traflic-light-fsm';
// ng test --main ./src/app/component/traffic-light/traflic-light-fsm.spec.ts

prettyPrintFSM(TraflicLightFSM);

describe(TraflicLightFSM.name, () => {

  it('isActionPointFull', async (done) => {
    // const fsm = getRole(RoleStatus.Idle);

    // const isDo = fsm.addAction(100);

    // expect(isDo).toBe(true);
    // expect(fsm.State).toBe(RoleStatus.Ready);
    done();
  });

});
