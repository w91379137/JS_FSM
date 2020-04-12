import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleFSM } from './role-fsm';
import { prettyPrintObj } from 'src/app/share/share-functions';
// ng test --main ./src/app/component/role/role-fsm.spec.ts

describe('RoleFSM', () => {

  beforeAll(() => {
    const testClass = RoleFSM;
    console.log(testClass.name);
    console.log(`EventDictionary:${prettyPrintObj(testClass.EventDictionary)}`);
    console.log(`GuardDictionary:${prettyPrintObj(testClass.GuardDictionary)}`);
  });

  it('Success', async (done) => {
    const fsm = new RoleFSM('Test');

    // let result = await pingTest('8.8.8.8');
    // expect(result).toBe(true);
    done();
  });


});
