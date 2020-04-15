import { prettyPrintObj } from './share-functions';

export function prettyPrintFSM(aClass: any) {
  console.log(aClass.name);
  console.log(`FSMDict:${prettyPrintObj(aClass.FSMDict)}`);
}
