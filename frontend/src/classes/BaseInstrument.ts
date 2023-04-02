import { IPatch, IInstrumentCategory } from "../../../common/types";

export class BaseInstrument {
  patch: IPatch;
  outputNode: AudioNode | null = null;
  audioContext: AudioContext | null = null;

  constructor(patch: IPatch) {
    this.patch = patch;
  }

  getIdentifier(): string {
    return this.patch.identifier;
  }

  getName(): string {
    return this.patch.name;
  }

  getCategory(): IInstrumentCategory {
    return this.patch.category;
  }

  getPatches(): IPatch {
    return this.patch;
  }

  setOutputNode(outputNode: AudioNode) {
    this.audioContext = outputNode.context as AudioContext;
    this.outputNode = outputNode;
  }
}
