import { IInstrument, IPlayerNote } from "../../../common/types";
import { guessCategoryFromName } from "../../../common/instrument-categories";
import { WebAudioFontPlayer, WavePreset } from "../classes/WebAudioFont";
import axios from "axios";
import { BaseInstrument } from "./BaseInstrument";

const store: {
  [key: string]: WavePreset;
} = {};

export class WAFInstrument extends BaseInstrument implements IInstrument {
  player: WebAudioFontPlayer | null = null;

  playedNotes: {
    [note: string]: any;
  } = {};

  playNote(note: IPlayerNote) {
    if (
      store[this.patch.options.variable] &&
      this.outputNode &&
      this.audioContext
    ) {
      const normalizedVelocity = note.velocity * 0.5;

      const playedNote = this.player?.queueWaveTable(
        this.audioContext,
        this.outputNode,
        store[this.patch.options.variable],
        0,
        note.number,
        20,
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
    if (this.audioContext) {
      this.player?.cancelQueue(this.audioContext);
    }

    for (const note in this.playedNotes) {
      this.playedNotes[note]?.cancel();
      delete this.playedNotes[note];
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject): void => {
      if (this.audioContext) {
        this.player = new WebAudioFontPlayer();

        if (!store[this.patch.options.variable]) {
          axios
            .get(this.patch.options.url)
            .then((response) => {
              store[this.patch.options.variable] = eval(
                response.data + "\n" + this.patch.options.variable
              );
              if (this.audioContext) {
                this.player?.adjustPreset(
                  this.audioContext,
                  store[this.patch.options.variable]
                );
              }

              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve();
        }
      }
    });
  }

  static getPatches() {
    return getPatches();
  }
}

export default WAFInstrument;

export function getPatches() {
  const player = new WebAudioFontPlayer();
  const instrumentKeys = player.loader.instrumentKeys();

  let patches = [];

  for (var i = 0; i < instrumentKeys.length; i++) {
    patches.push(player.loader.instrumentInfo(i));
  }

  patches = patches.map((patch, index) => {
    return {
      type: "WAFInstrument",
      identifier: `WAFInstrument@${patch.variable}`,
      name: patch.title,
      category: null,
      options: {
        url: patch.url,
        variable: patch.variable,
      },
    };
  });

  // Remove duplicates

  patches = patches.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.identifier === item.identifier)
  );

  return patches.map((item) => {
    return {
      ...item,
      category: guessCategoryFromName(item.name),
    };
  });
}
