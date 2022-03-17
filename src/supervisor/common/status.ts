export enum RecordStatus {
  DELETED = -1,
  NORMAL = 0,
}

export enum TaskStatus {
  DELETED = -1,
  NORMAL = 0, // has not started
  ONGOING = 1,
  PAUSING = 2,
  HAS_ENDED = 3
}