import { prettyPrintFSM } from 'src/app/share/fsm-debug';
import { TraflicLightFSM, LightStatus } from './traflic-light-fsm';
// ng test --main ./src/app/component/traffic-light/traflic-light-fsm.spec.ts

// prettyPrintFSM(TraflicLightFSM);

function getTraflicLight(state: LightStatus) {
  const fsm = new TraflicLightFSM();
  fsm.State = state;
  fsm.InGreenTime = 999;
  fsm.InYellowTime = 999;
  fsm.InRedTime = 999;
  // fsm.Notice.subscribe(e => {
  //   e.self = Object.assign({}, e.self);
  //   console.log(e);
  // });
  return fsm;
}

describe(TraflicLightFSM.name, () => {

  it('isInGreenTimeFull', async (done) => {
    const fsm = getTraflicLight(LightStatus.Green);

    const isDo = fsm.increaseTime();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(LightStatus.Yellow);
    done();
  });

  it('isInYellowTimeFull', async (done) => {
    const fsm = getTraflicLight(LightStatus.Yellow);

    const isDo = fsm.increaseTime();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(LightStatus.Red);
    done();
  });

  it('isInRedTimeFull', async (done) => {
    const fsm = getTraflicLight(LightStatus.Red);

    const isDo = fsm.increaseTime();

    expect(isDo).toBe(true);
    expect(fsm.State).toBe(LightStatus.Green);
    done();
  });

});
