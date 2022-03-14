import * as moment from 'moment';

export enum RecordStatus {
  DELETED = -1,
  NORMAL = 0,
}

export function getDay(date: Date = new Date()): string {
  return moment(date).format('YY-MM-DD');
}