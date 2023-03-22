import { IInstrument, IPlayerNote, IInstrumentItem } from "../types";
import Soundfont from "soundfont-player";

export class SFPInstrument implements IInstrument {
  name: string = "SFPInstrument";
  identifier: string = "";
  audioContext: AudioContext | null = null;
  soundfont: string;
  instrument: string;
  soundfontPlayer: Soundfont.Player | null = null;
  playedNotes: {
    [note: string]: Soundfont.Player;
  } = {};

  constructor(instrumentItem: IInstrumentItem) {
    this.soundfont = instrumentItem.options.soundfont;
    this.instrument = instrumentItem.options.instrument;
    this.name = instrumentItem.name;
    this.identifier = instrumentItem.identifier;
  }

  setAudioContext(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  getName(): string {
    return this.name;
  }

  playNote(note: IPlayerNote) {
    const playedNote = this.soundfontPlayer?.play(
      note.name,
      this.audioContext?.currentTime,
      { gain: note.velocity }
    );
    if (playedNote) {
      this.playedNotes[note.name] = playedNote;
    }
  }

  stopNote(note: IPlayerNote) {
    if (this.playedNotes[note.name]) {
      this.playedNotes[note.name]?.stop();
      delete this.playedNotes[note.name];
    }
  }

  dispose() {
    for (const note in this.playedNotes) {
      this.playedNotes[note]?.stop();
      delete this.playedNotes[note];
    }
  }

  async load() {
    if (this.audioContext) {
      this.soundfontPlayer = await Soundfont.instrument(
        this.audioContext,
        this.instrument as Soundfont.InstrumentName,
        { soundfont: this.soundfont }
      );
    }
  }
}

export default SFPInstrument;

export const instrumentsItems: IInstrumentItem[] = [
  {
    identifier: "SFP@FluidR3_GM#acoustic_grand_piano",
    type: "SFPInstrument",
    name: "Acoustic Grand Piano",
    options: {
      soundfont: "FluidR3_GM",
      instrument: "acoustic_grand_piano",
    },
  },
  {
    identifier: "SFP@FluidR3_GM#acoustic_bass",
    type: "SFPInstrument",
    name: "Acoustic Bass",
    options: {
      soundfont: "FluidR3_GM",
      instrument: "acoustic_bass",
    },
  },
];
