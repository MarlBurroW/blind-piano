import { IInstrument, IPlayerNote, IInstrumentItem } from "../types";

export class WAFInstrument implements IInstrument {
  name: string = "WAFInstrument";
  identifier: string = "";
  audioContext: AudioContext | null = null;
  player: WebAudioFontPlayer | null = null;
  url: string;
  variable: string;
  instrument: Object | null;
  playedNotes: {
    [note: string]: any;
  } = {};

  constructor(instrumentItem: IInstrumentItem) {
    this.name = instrumentItem.name;
    this.identifier = instrumentItem.identifier;
    this.url = instrumentItem.options.url;
    this.variable = instrumentItem.options.variable;
    this.instrument = null;
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
    if (this.instrument) {
      const playedNote = this.player?.queueWaveTable(
        this.audioContext,
        this.audioContext?.destination,
        this.instrument,
        0,
        note.number,
        10,
        note.velocity
      );

      this.playedNotes[note.name] = playedNote;
    }
  }

  stopNote(note: IPlayerNote) {
    if (this.playedNotes[note.name]) {
      this.playedNotes[note.name]?.cancel();
      delete this.playedNotes[note.name];
    }
  }

  dispose() {
    for (const note in this.playedNotes) {
      this.playedNotes[note]?.cancel();
      delete this.playedNotes[note];
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject): void => {
      if (this.audioContext) {
        this.player = new WebAudioFontPlayer();

        if (!window[this.variable]) {
          this.player.loader.startLoad(
            this.audioContext,
            this.url,
            this.variable
          );

          this.player.loader.waitLoad(() => {
            this.instrument = window[this.variable];
            resolve();
          });
        } else {
          this.instrument = window[this.variable];
          resolve();
        }
      }
    });
  }
}

function getInstrumentItems() {
  const player = new WebAudioFontPlayer();
  const instrumentKeys = player.loader.instrumentKeys();

  const instrumentItems = [];

  for (var i = 0; i < instrumentKeys.length; i++) {
    instrumentItems.push(player.loader.instrumentInfo(i));
  }
  return instrumentItems.map((instrumentItem, index) => {
    return {
      type: "WAFInstrument",
      identifier: `WAFInstrument@${instrumentItem.variable}`,
      name: index + ". " + instrumentItem.title,
      options: {
        url: instrumentItem.url,
        variable: instrumentItem.variable,
      },
    };
  });
}

console.log(getInstrumentItems());

export const instrumentsItems: IInstrumentItem[] = getInstrumentItems();
