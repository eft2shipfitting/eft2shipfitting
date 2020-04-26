import { Item } from "./item";

export interface ShipFit {
  title: string;
  fitName: string;
  highSlots: Item[];
  midSlots: Item[];
  lowSlots: Item[];
  drones: Item[];
  charges: Item[];
  rigs: Item[];
}
