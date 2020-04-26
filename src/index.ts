import './style.css';

import { EftParser } from "./eft-parser";
import { ShipFitGenerator } from './ship-fit-generator';

class Converter {
  private readonly eftParser: EftParser;
  private readonly shipFitGenerator: ShipFitGenerator;
  private shipfitting: HTMLElement;
  private eftInput: HTMLInputElement;
  private fitName: HTMLInputElement;

  constructor() {
    this.eftParser = new EftParser();
    this.shipFitGenerator = new ShipFitGenerator();
  }

  public show(): void {
    document.getElementsByTagName("body")[0].style.display = 'block';
  }

  public bind(): void {
    this.shipfitting = document.getElementById('shipfitting');
    this.eftInput = document.getElementById('eft-input') as HTMLInputElement;
    this.fitName = document.getElementById('fit-name') as HTMLInputElement;

    document.getElementById('convert').addEventListener('click', () => this.convertAndCopyToClipboard());

    this.eftInput.value = `[Rokh, Vanguards a]
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I
Modal Mega Neutron Particle Accelerator I

Federation Navy Stasis Webifier
Federation Navy Stasis Webifier
Sensor Booster II
Tracking Computer II

Damage Control II
Magnetic Field Stabilizer II
Magnetic Field Stabilizer II
Magnetic Field Stabilizer II
Tracking Enhancer II

Large Anti-Thermal Screen Reinforcer I
Large Core Defense Field Extender I
Large Core Defense Field Extender I

Hobgoblin I x5

Scan Resolution Script
Optimal Range Script
Caldari Navy Antimatter Charge L`
  };

  private async convertAndCopyToClipboard(): Promise<void> {
    const shipFit = await this.eftParser.parse(this.fitName.value, this.eftInput.value);
    const result = this.shipFitGenerator.generate(shipFit);
    this.shipfitting.innerText = result;

    navigator.clipboard.writeText(result);
  }
}

const converter = new Converter();
converter.bind();

window.addEventListener('load', () => converter.show());
