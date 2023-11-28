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

export interface IPlayer {
  id: string;
  nickname: string;
  avatarSeed: string;
  color: string;
}

export interface IPlayerNote {
  number: number;
  name: string;
  velocity: number;
  playerId: string;
  color: string;
}

export interface ITrack {
  id: string;
  name: string;
  patch: string;
  playerId: string | null;
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

export interface ISequencer {
  timeSignature: TimeSignature;
  tracks: Array<ITrack>;
}

export type TimeSignature = "3/4" | "4/4" | "5/4" | "6/8" | "7/8" | "12/8";
