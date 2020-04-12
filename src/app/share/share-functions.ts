
import * as moment from 'moment';

export function prettyPrintObj(obj: any): string {
  return JSON.stringify(obj, undefined, 2);
}

export function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function current(date: Date = new Date()): string {
  return moment(date).local().format('HH:mm:ss');
}
