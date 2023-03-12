export interface IIdentity {
  nickname: string;
  avatarSeed: string;
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
  attack?: number;
  playerId: string;
  color: string;
}
