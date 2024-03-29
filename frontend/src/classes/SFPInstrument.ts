import {
  IInstrument,
  IPlayerNote,
  IPatch,
  ICachableResource,
} from "../../../common/types";
import Soundfont from "soundfont-player";
import { guessCategoryFromName } from "../../../common/instrument-categories";
import { BaseInstrument } from "./BaseInstrument";

export class SFPInstrument extends BaseInstrument implements IInstrument {
  soundfontPlayer: Soundfont.Player | null = null;
  playedNotes: {
    [note: string]: Soundfont.Player;
  } = {};

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
        this.patch.options.instrument,
        {
          soundfont: this.patch.options.soundfont,
          destination: this.outputNode,
        }
      );
    }
  }

  static getPatches() {
    return getPatches();
  }

  static getCachableResources(): Array<ICachableResource> {
    const patches = getPatches();

    return patches.map((patch) => {
      return {
        url: `https://gleitz.github.io/midi-js-soundfonts/${patch.options.soundfont}/${patch.options.instrument}-ogg.js`,
        name: patch.name,
      };
    });
  }
}

export default SFPInstrument;

export function getPatches() {
  const instruments: Array<string> = [
    "acoustic_grand_piano",
    "bright_acoustic_piano",
    "electric_grand_piano",
    "honkytonk_piano",
    "electric_piano_1",
    "electric_piano_2",
    "harpsichord",
    "clavinet",
    "celesta",
    "glockenspiel",
    "music_box",
    "vibraphone",
    "marimba",
    "xylophone",
    "tubular_bells",
    "dulcimer",
    "drawbar_organ",
    "percussive_organ",
    "rock_organ",
    "church_organ",
    "reed_organ",
    "accordion",
    "harmonica",
    "tango_accordion",
    "acoustic_guitar_nylon",
    "acoustic_guitar_steel",
    "electric_guitar_jazz",
    "electric_guitar_clean",
    "electric_guitar_muted",
    "overdriven_guitar",
    "distortion_guitar",
    "guitar_harmonics",
    "acoustic_bass",
    "electric_bass_finger",
    "electric_bass_pick",
    "fretless_bass",
    "slap_bass_1",
    "slap_bass_2",
    "synth_bass_1",
    "synth_bass_2",
    "violin",
    "viola",
    "cello",
    "contrabass",
    "tremolo_strings",
    "pizzicato_strings",
    "orchestral_harp",
    "timpani",
    "string_ensemble_1",
    "string_ensemble_2",
    "synth_strings_1",
    "synth_strings_2",
    "choir_aahs",
    "voice_oohs",
    "synth_choir",
    "orchestra_hit",
    "trumpet",
    "trombone",
    "tuba",
    "muted_trumpet",
    "french_horn",
    "brass_section",
    "synth_brass_1",
    "synth_brass_2",
    "soprano_sax",
    "alto_sax",
    "tenor_sax",
    "baritone_sax",
    "oboe",
    "english_horn",
    "bassoon",
    "clarinet",
    "piccolo",
    "flute",
    "recorder",
    "pan_flute",
    "blown_bottle",
    "shakuhachi",
    "whistle",
    "ocarina",
    "lead_1_square",
    "lead_2_sawtooth",
    "lead_3_calliope",
    "lead_4_chiff",
    "lead_5_charang",
    "lead_6_voice",
    "lead_7_fifths",
    "lead_8_bass__lead",
    "pad_1_new_age",
    "pad_2_warm",
    "pad_3_polysynth",
    "pad_4_choir",
    "pad_5_bowed",
    "pad_6_metallic",
    "pad_7_halo",
    "pad_8_sweep",
    "fx_1_rain",
    "fx_2_soundtrack",
    "fx_3_crystal",
    "fx_4_atmosphere",
    "fx_5_brightness",
    "fx_6_goblins",
    "fx_7_echoes",
    "fx_8_scifi",
    "sitar",
    "banjo",
    "shamisen",
    "koto",
    "kalimba",
    "bagpipe",
    "fiddle",
    "shanai",
    "tinkle_bell",
    "agogo",
    "steel_drums",
    "woodblock",
    "taiko_drum",
    "melodic_tom",
    "synth_drum",
    "reverse_cymbal",
    "guitar_fret_noise",
    "breath_noise",
    "seashore",
    "bird_tweet",
    "telephone_ring",
    "helicopter",
    "applause",
    "gunshot",
  ];

  const soundfont = "FluidR3_GM";

  const formatInstrumentName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const patches: IPatch[] = instruments.map((instrument) => {
    const identifier = `SFP@${soundfont}#${instrument}`;
    const type = "SFPInstrument";
    const name = formatInstrumentName(instrument);
    const options = {
      soundfont,
      instrument,
    };

    return {
      identifier,
      type,
      name,
      options,
      category: guessCategoryFromName(name),
    };
  });

  return patches;
}
