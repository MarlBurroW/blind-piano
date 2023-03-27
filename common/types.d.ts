export interface IIdentity {
  nickname: string;
  avatarSeed: string;
  color: string;
}

export interface IPlayerSchema {
  nickname: string;
  avatarSeed: string;
  id: string;
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

export interface IInstrument {
  getIdentifier(): string;
  getName(): string;
  load: () => Promise<void>;
  setOutputNode: (outputNode: AudioNode) => void;
  playNote: (note: IPlayerNote) => void;
  stopNote: (note: IPlayerNote) => void;
  dispose: () => void;
}

export interface IInstrumentItem {
  type: string;
  identifier: string;
  name: string;
  options: any;
}
