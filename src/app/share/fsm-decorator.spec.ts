
import { prettyPrintFSM } from 'src/app/share/fsm-debug';
import { TestFSM, TestStatus, CountA, CountB, CountC } from './fsm-test';
import { FSMEventType } from './fsm-interface';
// ng test --main ./src/app/share/fsm-decorator.spec.ts

// prettyPrintFSM(TestFSM);

describe(TestFSM.name, () => {

  it('Test Class FSMDict', async (done) => {

    // tslint:disable-next-line:no-string-literal
    const FSMDict = TestFSM['FSMDict'] as any;

    expect(FSMDict.MainState).toBe('SomeSpecialNameState');
    expect(FSMDict.Notice).toBe('SomeSpecialNameNotice');
    expect(FSMDict.EventList.length).toBe(5);
    expect(FSMDict.GuardList.length).toBe(4);
    expect(FSMDict.ListenList.length).toBe(3);

    done();
  });

  it('Test Instance Loop', async (done) => {

    const fsm = new TestFSM();
    const logs = [];
    fsm.SomeSpecialNameNotice.subscribe(e => {
      e.self = Object.assign({}, e.self);
      logs.push(e);
    });

    for (let idx = 0; idx < 2; idx++) {

      expect(fsm.SomeSpecialNameState).toBe(TestStatus.A);
      expect(fsm.addB()).toBe(false);
      expect(fsm.addC()).toBe(false);
      expect(fsm.mustDoEvent()).toBe(true);
      expect(fsm.mustNotDoEvent()).toBe(false);
      for (let index = 0; index < CountA; index++) {
        expect(fsm.addA()).toBe(true);
      }

      expect(fsm.SomeSpecialNameState).toBe(TestStatus.B);
      expect(fsm.addA()).toBe(false);
      expect(fsm.addC()).toBe(false);
      expect(fsm.mustDoEvent()).toBe(true);
      expect(fsm.mustNotDoEvent()).toBe(false);
      for (let index = 0; index < CountB; index++) {
        expect(fsm.addB()).toBe(true);
      }

      expect(fsm.SomeSpecialNameState).toBe(TestStatus.C);
      expect(fsm.addA()).toBe(false);
      expect(fsm.addB()).toBe(false);
      expect(fsm.mustDoEvent()).toBe(true);
      expect(fsm.mustNotDoEvent()).toBe(false);
      for (let index = 0; index < CountC; index++) {
        expect(fsm.addC()).toBe(true);
      }
    }

    const EventTotal = (4 + CountA + 4 + CountB + 4 + CountC) * 2;
    const EventMustAccept = (1 + CountA + 1 + CountB + 1 + CountC) * 2;

    const EventAccept = logs.filter(ele => ele.type === FSMEventType.EventAccept);
    expect(EventAccept.length).toBe(EventMustAccept);

    const EventReject = logs.filter(ele => ele.type === FSMEventType.EventReject);
    expect(EventReject.length).toBe(EventTotal - EventMustAccept);
    // console.log(EventAccept.length, EventReject.length);

    const GuardAccept = logs.filter(ele => ele.type === FSMEventType.GuardAccept);
    expect(GuardAccept.length).toBe((1 + 1 + 1) * 2);
    // const GuardReject = logs.filter(ele => ele.type === FSMEventType.GuardReject);
    // console.log(GuardAccept.length, GuardReject.length);

    const BeforeTransition = logs.filter(ele => ele.type === FSMEventType.BeforeTransition);
    expect(BeforeTransition.length).toBe((1 + 1 + 1) * 2);

    const AfterTransition = logs.filter(ele => ele.type === FSMEventType.AfterTransition);
    expect(AfterTransition.length).toBe((1 + 1 + 1) * 2);
    // console.log(BeforeTransition.length, AfterTransition.length);

    done();
  });

});
