import { WAFInstrument } from "./WAFInstrument";
import { SFPInstrument } from "./SFPInstrument";
import { WAFDrumInstrument } from "./WAFDrumInstrument";
import { IPatch } from "../../../common/types";

export class InstrumentManager {
  patches: Map<string, IPatch>;

  constructor() {
    this.patches = this.getPatches();
  }

  createInstrument(patch: IPatch) {
    if (patch) {
      switch (patch.type) {
        case "SFPInstrument":
          return new SFPInstrument(patch);
        case "WAFInstrument":
          return new WAFInstrument(patch);
        case "WAFDrumInstrument":
          return new WAFDrumInstrument(patch);
      }
    }

    return null;
  }

  getPatches(): Map<string, IPatch> {
    const patches = new Map<string, IPatch>();

    for (const patch of WAFInstrument.getPatches()) {
      patches.set(patch.identifier, patch);
    }

    for (const patch of SFPInstrument.getPatches()) {
      patches.set(patch.identifier, patch);
    }

    for (const patch of WAFDrumInstrument.getPatches()) {
      patches.set(patch.identifier, patch);
    }

    return patches;
  }
}

export default new InstrumentManager();
