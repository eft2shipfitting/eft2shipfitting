import { EsiApi, UniverseItem, UniverseType } from './esi-api';
import { Item, Slot } from './item';
import { ShipFit } from './ship-fit';

interface EftLine {
  name: string;
  amount: number;
}

export class EftParser {
  private readonly effectToSlot: Map<number, Slot> = new Map([
    [16, Slot.high],
    [13, Slot.mid],
    [11, Slot.low],
    [2663, Slot.rig],
  ]);
  private readonly droneGroupIds = [
    97,
    100,
    101,
    299,
    470,
    544,
    545,
    549,
    639,
    640,
    641,
    1023,
    1159
  ];
  private readonly chargeIds = [
    83,
    85,
    86,
    87,
    88,
    89,
    90,
    92,
    372,
    373,
    374,
    375,
    376,
    377,
    384,
    385,
    386,
    387,
    394,
    395,
    396,
    425,
    476,
    479,
    482,
    492,
    497,
    498,
    500,
    548,
    648,
    653,
    654,
    655,
    656,
    657,
    663,
    772,
    863,
    864,
    892,
    907,
    908,
    909,
    910,
    911,
    916,
    972,
    1010,
    1019,
    1153,
    1158,
    1400,
    1546,
    1547,
    1548,
    1549,
    1550,
    1551,
    1559,
    1569,
    1677,
    1678,
    1701,
    1702,
    1769,
    1771,
    1772,
    1773,
    1774,
    1976,
    1987,
    1989
  ];

  private readonly esiApi: EsiApi;

  constructor() {
    this.esiApi = new EsiApi();
  }

  async parse(fitName: string, eft: string): Promise<ShipFit> {
    const [rawTitle, ...rawItems] = eft.trim().split(/\r?\n/);
    const titleMatch = /\[(?<title>.*)\]/.exec(rawTitle);
    const title = titleMatch === null ? 'No Title' : titleMatch.groups['title'];

    const eftLines = rawItems.map(x => x.trim()).filter(x => x !== '')
      .map(this.parseEftLine);
    const universeItems = await this.esiApi.getItemIds(eftLines.map(x => x.name));
    const universeTypes = await Promise.all(universeItems.map(async item => await this.esiApi.getType(item.id)));

    const foundItems = eftLines.map(eftLine => ({
      eftLine,
      universeItem: universeItems.find(x => x.name === eftLine.name)
    })).map(({eftLine, universeItem}) => ({
      eftLine,
      universeType: universeTypes.find(x => x.type_id === universeItem.id)
    }))
    .filter(x => x.universeType !== undefined);

    const items = foundItems.map(({eftLine, universeType}) => this.parseItem(eftLine, universeType));

    return {
      title,
      fitName,
      highSlots: items.filter(x => x.slot === Slot.high),
      midSlots: items.filter(x => x.slot === Slot.mid),
      lowSlots: items.filter(x => x.slot === Slot.low),
      drones: items.filter(x => x.slot === Slot.drone),
      charges: items.filter(x => x.slot === Slot.charge),
      rigs: items.filter(x => x.slot === Slot.rig),
    };
  }

  private parseEftLine(line: string): EftLine {
    // EFT uses the x[0-9]+ notation to show number of items
    const amountMatch = /(?<name>.*)\s+x(?<amount>\d+)$/.exec(line);
    const name = amountMatch !== null ? amountMatch.groups['name'] : line;
    const amount = amountMatch !== null ? Number.parseInt(amountMatch.groups['amount']) : 1;
    return {
      name,
      amount
    };
  }

  private parseItem(eftLine: EftLine, universeType: UniverseType): Item {
    const slot = this.parseSlot(universeType);
    const name = eftLine.amount > 1 ? `${eftLine.name} x${eftLine.amount}` : eftLine.name;
    return {
      name,
      typeId: universeType.type_id,
      slot
    }
  }

  private parseSlot(universeType: UniverseType): Slot {
    const effectIds = universeType.dogma_effects.map(x => x.effect_id);
    const effectId = effectIds.find(id => this.effectToSlot.has(id));

    if (effectId !== undefined) {
      return this.effectToSlot.get(effectId);
    }

    // Not a high, mid, low, or rig module
    if (this.droneGroupIds.includes(universeType.group_id)) {
      return Slot.drone;
    }

    if (this.chargeIds.includes(universeType.group_id)) {
      return Slot.charge;
    }
  }
}
