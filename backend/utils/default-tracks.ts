import { MapSchema } from "@colyseus/schema";
import Track from "../schemas/Track";
import { v4 } from "uuid";

export function getDefaultTracks() {
  const defaultTracks = new MapSchema<Track>();

  const data = [
    {
      id: v4(),
      name: "Piano",
      patch: "WAFInstrument@_tone_0001_FluidR3_GM_sf2_file",
      playerId: null,
    },
    {
      id: v4(),
      name: "Drum",
      patch: "WAFDrumInstrument@_0_Chaos_sf2_file",
      playerId: null,
    },
    {
      id: v4(),
      name: "Bass",
      patch: "WAFInstrument@_tone_0340_Aspirin_sf2_file",
      playerId: null,
    },
  ];

  data.forEach(track => {
    const trackSchema = new Track();
    trackSchema.id = track.id;
    trackSchema.name = track.name;
    trackSchema.patch = track.patch;
    trackSchema.playerId = track.playerId;
    defaultTracks.set(track.id, trackSchema);
  });

  return defaultTracks;
}
