export interface IIdentity {
  nickname: string;
  avatarSeed: string;
  color: string;
}

export interface ICachableResource {
  name: string;
  url: string;
}

export interface IMessage {
  message: string;
  player?: Player;
  id: string;
}

export interface IPlayerNote {
  number: number;
  name: string;
  velocity: number;
  playerId: string;
  color: string;
}

export interface ITransportNote {
  number: number;
  name: string;
  velocity?: number;
}

export interface IInstrument {
  getIdentifier(): string;
  getPatches(): IPatches;
  getName(): string;
  load(): Promise<void>;
  setOutputNode(outputNode: AudioNode): void;
  playNote(note: IPlayerNote): void;
  stopNote(note: IPlayerNote): void;
  dispose(): void;
  getCategory(): IInstrumentCategory;
}
export interface IInstrumentCategory {
  identifier: string;
  icon: string;
}

export interface IPatch {
  type: string;
  identifier: string;
  name: string;
  options: any;
  category: IIinstrumentCategory;
}
