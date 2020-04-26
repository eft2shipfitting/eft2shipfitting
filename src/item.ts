export interface Item {
  typeId: number;
  name: string;
  slot: Slot;
}

export enum Slot {
  high,
  mid,
  low,
  drone,
  charge,
  rig
}
