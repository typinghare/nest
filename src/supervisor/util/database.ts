import * as moment from 'moment';
import { InsertResult } from 'typeorm';

export function getIdFromInsertResult(insertResult: InsertResult): number {
  return insertResult.identifiers[0].id;
}

export function getDay(date: Date = new Date()): string {
  return moment(date).format('YY-MM-DD');
}

export function getMinuteDifference(time1: Date, time2: Date): number {
  return Math.floor((time1.getTime() - time2.getTime()) / 60000);
}

//
// type Entity = NodeJS.Dict<any>;
//
// export function fieldSelect(entities: Entity | Entity[], prescription: NodeJS.Dict<string>): Entity | Entity[] {
//   const isSingle = !Array.isArray(entities);
//   entities = isSingle ? [entities] : entities;
//   const arr = [];
//
//   for (const entity of <NodeJS.Dict<any>[]>entities) {
//     const r = {};
//     for (const name in prescription) {
//       let obj = entity;
//       const path: string = prescription[name];
//       for (const next of path.split('.').map(s => s.trim())) {
//         if (next in obj) {
//           obj = obj[next];
//         } else {
//           throw new Error(`Unexpected path: ${path}.`);
//         }
//       }
//       r[name] = obj;
//     }
//     arr.push(r);
//   }
//
//   return isSingle ? arr[0] : arr;
// }
//
// // export class FieldSelector {
// //   private readonly entities: NodeJS.Dict<any>[];
// //
// //   private selected: NodeJS.Dict<any> = [];
// //
// //   private readonly isSingle: boolean;
// //
// //   constructor(entities: NodeJS.Dict<any> | NodeJS.Dict<any>[]) {
// //     this.isSingle = !Array.isArray(entities);
// //     this.entities = this.isSingle ? [entities] : <NodeJS.Dict<any>[]>entities;
// //     for (let i = 0; i < this.entities.length; i++)
// //       this.selected.push({});
// //   }
// //
// //   select(fields: string | string[], level = ''): FieldSelector {
// //     for (let i = 0; i < this.entities.length; i++) {
// //       if (this.selectOne(i, fields, level) === false) {
// //         throw new Error(`Unexpected fields given: ${fields}.`);
// //       }
// //     }
// //
// //     return this;
// //   }
// //
// //   private selectOne(index: number, fields: string | string[], level = ''): boolean {
// //     let entity = this.entities[index];
// //     const sp = level.split('.').map(s => s.trim());
// //     if (level !== '') {
// //       for (const next of sp) {
// //         if (next in entity) entity = entity[next];
// //         else return false;
// //       }
// //     }
// //
// //     let selected: NodeJS.Dict<any> = this.selected[index];
// //     if (level !== '') {
// //       for (const next of sp) selected = selected[next] = {};
// //     }
// //
// //     if (typeof fields === 'string') fields = [fields];
// //     for (const field of fields) {
// //       selected[field] = entity[field];
// //     }
// //
// //     return true;
// //   }
// //
// //   selectExceptOne(index: number, fields: string | string[], level = ''): boolean {
// //     let entity = this.entities[index];
// //     const sp = level.split('.').map(s => s.trim());
// //     if (level !== '') {
// //       for (const next of sp) {
// //         if (next in entity) entity = entity[next];
// //         else return false;
// //       }
// //     }
// //
// //     let selected: NodeJS.Dict<any> = this.selected;
// //     if (level !== '') {
// //       const last = sp.pop();
// //       for (const next of sp) selected = selected[next] = {};
// //       selected[last] = Object.create(entity);
// //     } else {
// //       this.selected = selected = Object.create(entity);
// //     }
// //
// //     if (typeof fields === 'string') fields = [fields];
// //     for (const field of fields) {
// //       delete selected[field];
// //     }
// //
// //     return true;
// //   }
// //
// //   getSelected(): NodeJS.Dict<any> {
// //     return this.selected;
// //   }
// // }