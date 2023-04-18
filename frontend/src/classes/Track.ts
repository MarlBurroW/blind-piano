import EventEmitter from "eventemitter3";

import { IPatch, ITrack } from "../../../common/types";
import instrumentManager from "./InstrumentManager";

export class Track {
  public id: string;
  public bus: EventEmitter;
  public audioContext: AudioContext;
  public gainNode: GainNode;
  public patch: IPatch | null;
  public analyserNode: AnalyserNode | null;
  public playerId: string | null;

  constructor(track: ITrack, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.id = track.id;
    this.bus = new EventEmitter();
    this.gainNode = this.audioContext.createGain();
    this.patch = instrumentManager.getPatch(track.patch);
    this.analyserNode = this.audioContext.createAnalyser();
    this.gainNode.connect(this.analyserNode);
    this.playerId = track.playerId;
  }

  setTrackData(track: ITrack) {
    this.id = track.id;
    this.patch = instrumentManager.getPatch(track.patch);
    this.playerId = track.playerId;
    this.bus.emit("track-data-changed", this);
  }

  setAudioContext(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  setGainNode(gainNode: GainNode) {
    this.gainNode = gainNode;
  }

  setBus(bus: EventEmitter) {
    this.bus = bus;
  }

  setGain(gain: number) {
    this.gainNode.gain.value = gain;
  }

  setAnalyserNode(analyserNode: AnalyserNode) {
    this.analyserNode = analyserNode;
  }

  connect(node: AudioNode) {
    this.gainNode.connect(node);
  }
}

export default Track;
