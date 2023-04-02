import { IInstrument, IPlayerNote } from "../../../common/types";

import axios from "axios";
import { instrumentCategories } from "../../../common/instrument-categories";
import { WebAudioFontPlayer, WavePreset } from "../classes/WebAudioFont";
import { BaseInstrument } from "./BaseInstrument";

const store: {
  [key: string]: WavePreset;
} = {};

export class WAFDrumInstrument extends BaseInstrument implements IInstrument {
  player: WebAudioFontPlayer | null = null;

  playNote(note: IPlayerNote) {
    const variable = `_drum_${note.number}${this.patch.options.file}`;
    const sound = store[variable];

    if (this.audioContext && this.player && this.outputNode && sound) {
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
    if (this.audioContext) this.player?.cancelQueue(this.audioContext);
  }

  load(): Promise<void> {
    return new Promise((resolve, reject): void => {
      if (this.audioContext) {
        this.player = new WebAudioFontPlayer();
        const loadPromises = [];
        for (let i = 35; i <= 81; i++) {
          const variable = `_drum_${i}${this.patch.options.file}`;

          if (store[variable]) continue;

          const url = `${this.patch.options.baseUrl}128${i}${this.patch.options.file}.js`;
          const promise = axios
            .get(url)
            .then((response) => {
              store[variable] = eval(response.data + "\n" + variable);

              if (this.audioContext) {
                this.player?.adjustPreset(this.audioContext, store[variable]);
              }
            })
            .catch((error) => {
              reject(error);
            });

          loadPromises.push(promise);
        }

        Promise.all(loadPromises).then(() => {
          console.log("fully loaded");
          resolve();
        });
      }
    });
  }
  static getPatches() {
    return getPatches();
  }
}

export default WAFDrumInstrument;

export function getPatches() {
  const items = [
    {
      type: "WAFDrumInstrument",
      identifier: `WAFDrumInstrument@_0_Chaos_sf2_file`,
      name: "Chaos Drum",
      category: instrumentCategories.drumkit,
      options: {
        baseUrl: "https://surikov.github.io/webaudiofontdata/sound/",
        file: "_0_Chaos_sf2_file",
      },
    },
  ];

  return items;
}
