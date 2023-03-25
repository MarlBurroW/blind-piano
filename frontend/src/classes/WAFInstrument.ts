import { IInstrument, IPlayerNote, IInstrumentItem } from "../types";

export class WAFInstrument implements IInstrument {
  name: string = "WAFInstrument";
  identifier: string = "";
  audioContext: AudioContext | null = null;
  outputNode: AudioNode | null = null;
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
    this.audioContext = null;
    this.outputNode = null;
  }

  setOutputNode(outputNode: AudioNode) {
    this.audioContext = outputNode.context as AudioContext;
    this.outputNode = outputNode;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  getName(): string {
    return this.name;
  }

  playNote(note: IPlayerNote) {
    if (this.instrument && this.outputNode) {
      const normalizedVelocity = note.velocity * 0.5;
      const playedNote = this.player?.queueWaveTable(
        this.audioContext,
        this.outputNode,
        this.instrument,
        0,
        note.number,
        10,
        normalizedVelocity
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

  let instrumentItems = [];

  for (var i = 0; i < instrumentKeys.length; i++) {
    instrumentItems.push(player.loader.instrumentInfo(i));
  }

  instrumentItems = instrumentItems.map((instrumentItem, index) => {
    return {
      type: "WAFInstrument",
      identifier: `WAFInstrument@${instrumentItem.variable}`,
      name: "(WAF) " + instrumentItem.title,
      options: {
        url: instrumentItem.url,
        variable: instrumentItem.variable,
      },
    };
  });

  // Remove duplicates

  instrumentItems = instrumentItems.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.identifier === item.identifier)
  );

  return instrumentItems;
}

export const instrumentsItems: IInstrumentItem[] = getInstrumentItems();