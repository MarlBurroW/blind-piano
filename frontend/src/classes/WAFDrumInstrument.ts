import {
  IInstrument,
  IPlayerNote,
  IInstrumentItem,
} from "../../../common/types";

import axios from "axios";

export class WAFDrumInstrument implements IInstrument {
  name: string = "WAFDrumInstrument";
  identifier: string = "";
  audioContext: AudioContext | null = null;
  outputNode: AudioNode | null = null;
  player: WebAudioFontPlayer | null = null;
  instrument: Object | null;
  playedNotes: {
    [note: string]: any;
  } = {};
  options: any;

  constructor(instrumentItem: IInstrumentItem) {
    this.name = instrumentItem.name;
    this.identifier = instrumentItem.identifier;
    this.instrument = null;
    this.audioContext = null;
    this.outputNode = null;
    this.options = instrumentItem.options;
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
    const sound = window[`_drum_${note.number}${this.options.file}`];
    if (this.player && this.outputNode && sound) {
      this.player.queueWaveTable(
        this.audioContext,
        this.outputNode,
        sound,
        0,
        note.number,
        3
      );
    }
  }

  stopNote(note: IPlayerNote) {}

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
        const loadPromises = [];
        for (let i = 35; i <= 81; i++) {
          const variable = `_drum_${i}${this.options.file}`;
          const url = `${this.options.baseUrl}128${i}${this.options.file}.js`;
          const promise = axios
            .get(url)
            .then((response) => {
              eval.call(window, response.data);
              this.player.loader.decodeAfterLoading(
                this.audioContext,
                variable
              );
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });

          loadPromises.push(promise);
        }

        Promise.all(loadPromises).then(() => {
          resolve();
        });
      }
    });
  }
}

export const instrumentsItems: IInstrumentItem[] = [
  {
    type: "WAFDrumInstrument",
    identifier: `WAFDrumInstrument@_0_Chaos_sf2_file`,
    name: "Chaos Drum",
    options: {
      baseUrl: "https://surikov.github.io/webaudiofontdata/sound/",
      file: "_0_Chaos_sf2_file",
    },
  },
];
