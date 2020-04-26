import uniq from 'lodash/uniq';

export interface UniverseItem {
  id: number,
  name: string;
}

export interface DogmaEffect {
  effect_id: number;
}

export interface UniverseType {
  type_id: number;
  group_id: number;
  dogma_effects: DogmaEffect[];
}

export interface UniverseIdsResponse {
  inventory_types: UniverseItem[]
}

export class EsiApi {
  async getItemIds(items: string[]): Promise<UniverseItem[]> {
    const response: Response = await fetch('https://esi.evetech.net/latest/universe/ids/', {
      body: JSON.stringify(uniq(items)),
      method: 'POST',
    });

    const universeIds = await response.json() as UniverseIdsResponse;
    return universeIds.inventory_types;
  }

  async getType(typeId: number): Promise<UniverseType> {
    const response: Response = await fetch(`https://esi.evetech.net/latest/universe/types/${typeId}/`);
    return await response.json();
  }
}
