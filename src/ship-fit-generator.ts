import { ShipFit } from './ship-fit';
import { Item } from './item';

export class ShipFitGenerator {
  generate(fit: ShipFit): string {
    return `{{ShipFitting
| ship=${fit.title}
| fitName=${fit.fitName}
${this.generateSlot('high', fit.highSlots)}
${this.generateSlot('mid', fit.midSlots)}
${this.generateSlot('low', fit.lowSlots)}
${this.generateSlot('drone', fit.drones)}
${this.generateSlot('charge', fit.charges)}
${this.generateSlot('rig', fit.rigs)}
}}`
  }

  generateSlot(slotName: string, items: Item[]): string {
    let result = '';
    for (let i = 0; i < items.length; i++) {
      result = result.concat(
        `| ${slotName}${i+1}name=${items[i].name}
| ${slotName}${i+1}typeID=${items[i].typeId}
`);
    }
    return result;
  }
}
