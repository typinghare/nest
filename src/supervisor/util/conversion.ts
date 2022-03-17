/**
 * Convert an entity to a VO(value object).
 * @param entity
 * @param prescription
 */
export function convertToVo<Vo>(entity: object, prescription: { [k in keyof Vo]: string }): Vo {
  const r = {} as Vo;
  for (const name in prescription) {
    let obj = entity;
    const path: string = prescription[name];
    for (const next of path.split('.').map(s => s.trim())) {
      if (!(next in obj)) throw new Error(`Unexpected path: ${path}.`);
      obj = obj[next];
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    r[name] = obj;
  }
  return r;
}

/**
 * Convert an entity array to a VO(value object) array.
 * @param entities
 * @param prescription
 */
export function convertToVoArray<Vo>(entities: object[], prescription: { [k in keyof Vo]: string }): Vo[] {
  const arr = [] as Vo[];
  for (const entity of entities) {
    arr.push(convertToVo(entity, prescription));
  }
  return arr;
}