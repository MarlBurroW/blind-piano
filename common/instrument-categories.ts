import { IInstrumentCategory } from "./types";

export const instrumentCategories: { [key: string]: IInstrumentCategory } = {
  piano: {
    identifier: "piano",
    icon: "bp-34",
  },
  electricGuitar: {
    identifier: "electric-guitar",
    icon: "bp-1",
  },
  acousticGuitar: {
    identifier: "acoustic-guitar",
    icon: "bp-24",
  },
  sax: {
    identifier: "sax",
    icon: "bp-2",
  },
  distortionGuitar: {
    identifier: "distortion-guitar",
    icon: "bp-39",
  },
  synth: {
    identifier: "synth",
    icon: "bp-30",
  },
  harmonica: {
    identifier: "harmonica",
    icon: "bp-8",
  },
  brass: {
    identifier: "brass",
    icon: "bp-31",
  },
  xilophone: {
    identifier: "xilophone",
    icon: "bp-37",
  },
  string: {
    identifier: "string",
    icon: "bp-45",
  },
  accordion: {
    identifier: "accordion",
    icon: "bp-10",
  },
  flute: {
    identifier: "flute",
    icon: "bp-44",
  },
  percusive: {
    identifier: "percusive",
    icon: "bp-25",
  },
  englishHorn: {
    identifier: "english-horn",
    icon: "bp-5",
  },
  drumkit: {
    identifier: "drumkit",
    icon: "bp-33",
  },
  organ: {
    identifier: "organ",
    icon: "bp-9",
  },
  banjo: {
    identifier: "banjo",
    icon: "bp-20",
  },
  bassGuitar: {
    identifier: "bass-guitar",
    icon: "bp-46",
  },
};

export function guessCategoryFromName(name: string): IInstrumentCategory {
  if (name.toLowerCase().includes("piano")) {
    return instrumentCategories.piano;
  } else if (name.toLowerCase().includes("guitar")) {
    if (name.toLowerCase().includes("electric")) {
      return instrumentCategories.electricGuitar;
    }
    if (name.toLowerCase().includes("distortion")) {
      return instrumentCategories.distortionGuitar;
    }

    return instrumentCategories.acousticGuitar;
  } else if (name.toLowerCase().includes("synth")) {
    return instrumentCategories.synth;
  } else if (name.toLowerCase().includes("sax")) {
    return instrumentCategories.sax;
  } else if (name.toLowerCase().includes("harmonica")) {
    return instrumentCategories.harmonica;
  } else if (
    name.toLowerCase().includes("brass") ||
    name.toLowerCase().includes("trumpet")
  ) {
    return instrumentCategories.brass;
  } else if (
    name.toLowerCase().includes("marimba") ||
    name.toLowerCase().includes("xylophone") ||
    name.toLowerCase().includes("vibraphone")
  ) {
    return instrumentCategories.xilophone;
  } else if (
    name.toLowerCase().includes("string") ||
    name.toLowerCase().includes("violin") ||
    name.toLowerCase().includes("cello")
  ) {
    return instrumentCategories.string;
  } else if (name.toLowerCase().includes("accordion")) {
    return instrumentCategories.accordion;
  } else if (name.toLowerCase().includes("flute")) {
    return instrumentCategories.flute;
  } else if (name.toLowerCase().includes("percussive")) {
    return instrumentCategories.percusive;
  } else if (name.toLowerCase().includes("english-horn")) {
    return instrumentCategories.englishHorn;
  } else if (name.toLowerCase().includes("drumkit")) {
    return instrumentCategories.drumkit;
  } else if (name.toLowerCase().includes("organ")) {
    return instrumentCategories.organ;
  } else if (name.toLowerCase().includes("banjo")) {
    return instrumentCategories.banjo;
  } else if (name.toLowerCase().includes("bass")) {
    return instrumentCategories.bassGuitar;
  }

  return instrumentCategories.piano;
}
