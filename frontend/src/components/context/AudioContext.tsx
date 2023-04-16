import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";

import { IPatch, IPlayerNote, ITrack } from "../../../../common/types";
import instrumentManager from "../../classes/InstrumentManager";
import Track from "../../classes/Track";
import { Instruments } from "../Instruments";
import { GameContext } from "./GameContext";
import { MidiContext } from "./MidiContext";

interface IAudioContext {
  masterAudioContext: AudioContext | null;
  setMasterGain: (value: number) => void;
  masterGainValue: number;
  patches: Map<string, IPatch>;
  tracks: Record<string, Track>;
}

const DEFAULT_MASTER_GAIN = 0.75;
const DEFAULT_PLAYER_GAIN = 0.75;

const initialContextValues = {
  masterAudioContext: null,
  setMasterGain: (value: number) => {},
  masterGainValue: DEFAULT_MASTER_GAIN,
  patches: new Map<string, IPatch>(),
  tracks: {},
};

interface AudioContextState {
  tracks: Record<string, Track>;
}

const initialState: AudioContextState = {
  tracks: {},
};

export const AudioContext =
  React.createContext<IAudioContext>(initialContextValues);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { tracks: tracksData } = useContext(GameContext);
  const { midiBus$: midiBus } = useContext(MidiContext);
  const masterAudioContextRef = useRef<AudioContext>(new window.AudioContext());
  const masterGainRef = useRef<GainNode>(
    masterAudioContextRef.current.createGain()
  );
  const [contextState, setContextState] = useImmer(initialState);
  const { tracks } = contextState;
  const masterGainValueRef = useRef<number>(DEFAULT_MASTER_GAIN);
  const updateGain = (value: number) => {
    masterGainValueRef.current = value;
    updateMasterGain();
  };
  const playersTracksMapping = useMemo(() => {
    const map = new Map<string, string>();

    for (const trackData of tracksData) {
      if (trackData && trackData.playerId) {
        map.set(trackData.playerId, trackData.id);
      }
    }
    return map;
  }, [tracksData]);

  useEffect(() => {
    masterGainRef.current.connect(masterAudioContextRef.current.destination);

    return () => {
      masterGainRef.current.disconnect(
        masterAudioContextRef.current.destination
      );
    };
  }, [masterAudioContextRef.current, masterGainRef.current]);

  const updateMasterGain = useCallback(() => {
    const gainNode = masterGainRef.current;
    const gainValue = masterGainValueRef.current;
    gainNode.gain.setTargetAtTime(
      gainValue,
      masterAudioContextRef.current.currentTime,
      0.01
    );
  }, []);

  useEffect(() => {
    updateMasterGain();
  }, [updateMasterGain]);

  useEffect(() => {
    midiBus?.on("noteon", (note: IPlayerNote) => {
      const trackId = playersTracksMapping.get(note.playerId);
      if (!trackId) return;

      const track = tracks[trackId];

      if (track) {
        track.bus.emit("noteon", note);
      }
    });

    midiBus?.on("noteoff", (note: IPlayerNote) => {
      const trackId = playersTracksMapping.get(note.playerId);
      if (!trackId) return;

      const track = tracks[trackId];

      if (track) {
        track.bus.emit("noteoff", note);
      }
    });

    return () => {
      midiBus?.off("noteon");
      midiBus?.off("noteoff");
    };
  }, [midiBus, playersTracksMapping]);

  const patches = useMemo(() => {
    return instrumentManager.getPatches();
  }, []);

  useEffect(() => {
    for (const trackData of tracksData) {
      const { id: trackId, patch: patchIdentifier } = trackData;

      // Check if track already exists

      if (tracks.hasOwnProperty(trackId)) {
        // If track exists, check if patch has changed

        const track = tracks[trackId];

        if (track?.patch?.identifier !== trackData.patch) {
          // Track patch has changed, update it

          const patch = patches.get(patchIdentifier);

          if (patch) {
            track?.setTrackData(trackData);
          }
        }
      } else {
        // Track doesn't exist yet, we create it

        // Patch is mandatory to create a track, so we create it only if it exists
        const patch = patches.get(patchIdentifier);

        if (patch) {
          const track = new Track(trackData, masterAudioContextRef.current);

          track.setTrackData(trackData);

          setContextState(draft => {
            draft.tracks[trackId] = track;
          });

          // Set the default track default gain to default value

          track.setGain(DEFAULT_PLAYER_GAIN);

          // Once track is created, we can connect it to the master gain node

          track.connect(masterGainRef.current);
        }
      }
    }
  }, [tracksData]);

  return (
    <AudioContext.Provider
      value={{
        masterAudioContext: masterAudioContextRef.current,
        masterGainValue: masterGainValueRef.current,
        setMasterGain: updateGain,
        patches: patches,
        tracks: tracks,
      }}
    >
      <>
        <Instruments tracks={tracks}></Instruments>

        {children}
      </>
    </AudioContext.Provider>
  );
}

export default AudioProvider;
