import { useCallback, useContext, useMemo, useRef, useState } from "react";
import type { Input } from "webmidi";

import { colors } from "../../../common/colors";
import { IInstrument, IPatch } from "../../../common/types";
import { AudioContext } from "../components/context/AudioContext";
import { GameContext } from "../components/context/GameContext";
import { MidiContext } from "../components/context/MidiContext";

export function useMidiBus() {
  const { midiBus$ } = useContext(MidiContext);

  return midiBus$;
}

export function useTrackMixerControl(trackId: string) {
  const { tracks } = useContext(AudioContext);

  const track = tracks[trackId];

  const setVolume = useCallback(
    (value: number) => {
      return track?.setGain(value);
    },
    [trackId]
  );

  return { setVolume, volume: track?.gainNode.gain.value };
}

export function useMasterMixerControl() {
  const { setMasterGain, masterGainValue } = useContext(AudioContext);

  const setVolume = useCallback(
    (value: number) => {
      return setMasterGain(value);
    },
    [setMasterGain]
  );

  const volume = useMemo(() => {
    return masterGainValue;
  }, [setMasterGain]);

  return { setVolume, volume };
}

export function useMidiDevices() {
  const { devices, selectedDevice, selectDevice } = useContext(MidiContext);

  const midiDevices = useMemo(() => {
    return devices;
  }, [devices]);

  const selectedMidiDevice = useMemo(() => {
    return selectedDevice;
  }, [selectedDevice]);

  const selectMidiDevice = useCallback(
    (device: Input | null) => {
      return selectDevice(device);
    },
    [selectDevice]
  );

  return {
    midiDevices,
    selectedMidiDevice,
    selectMidiDevice,
  };
}

export function useMe() {
  const { me } = useContext(GameContext);

  return me;
}

export function useLeader() {
  const { leader } = useContext(GameContext);

  return leader;
}

export function useGameRoom() {
  const { gameRoom } = useContext(GameContext);

  return gameRoom;
}

export function useIntrumentItems() {
  const { patches } = useContext(AudioContext);

  return patches;
}

export function useGameState() {
  const { gameState } = useContext(GameContext);

  return gameState;
}

export function useChat() {
  const { messages } = useContext(GameContext);
  const gameRoom = useGameRoom();
  const gameState = useGameState();
  const playersMap = usePlayersMap();
  const me = useMe();

  const sendMessage = useCallback(
    (message: string) => {
      gameRoom?.send("chat-message", message);
    },
    [gameRoom]
  );

  const sendTyping = useCallback(() => {
    gameRoom?.send("chat-typing");
  }, [gameRoom]);

  const typingStates = useMemo(() => {
    return gameState?.typing || new Map();
  }, [gameState]);

  const playersTyping = useMemo(() => {
    return Array.from(typingStates.keys())
      .filter(id => id !== me?.id && typingStates.get(id))
      .map(id => {
        return playersMap.get(id);
      });
  }, [typingStates, playersMap]);

  return {
    messages,
    sendMessage,
    sendTyping,
    typingStates,
    playersTyping,
  };
}

export function usePatch(patchIdentifier: string): IPatch | null {
  const { patches } = useContext(AudioContext);

  const patch = patches.get(patchIdentifier);

  return patch || null;
}

export function useSelectPatch() {
  const gameRoom = useGameRoom();

  const selectPatch = useCallback(
    (patch: IPatch) => {
      if (gameRoom) {
        gameRoom.send("set-patch", patch.identifier);
      }
    },
    [gameRoom]
  );

  return selectPatch;
}

export function usePlayer(playerId: string | null) {
  const { gameState } = useContext(GameContext);

  const player = gameState?.players.get(playerId || "");

  return player || null;
}

export function usePlayersMap() {
  const { gameState } = useContext(GameContext);

  const players = gameState?.players;

  return players || new Map();
}

export function usePlayers() {
  const { players } = useContext(GameContext);

  return players;
}

export function useTracks() {
  const { tracks } = useContext(GameContext);

  return tracks;
}

export function useTrackAnalyser(trackId: string) {
  const { tracks } = useContext(AudioContext);

  const track = tracks[trackId];

  if (track) {
    return track.analyserNode;
  }
}

export function useColors() {
  const players = usePlayers();
  const me = useMe();

  const availableColors = useMemo(() => {
    const allPlayersExceptMe = players.filter(player => player.id !== me?.id);

    return colors.filter(color => {
      return !allPlayersExceptMe.find(player => player.color === color);
    });
  }, [players]);

  return {
    colors,
    availableColors,
  };
}

export function useIdentityModalControl() {
  const { isIdentityModalOpen, setState } = useContext(GameContext);

  const openIdentityModal = useCallback(() => {
    setState(draft => {
      draft.isIdentityModalOpen = true;
    });
  }, []);

  const closeIdentityModal = useCallback(() => {
    setState(draft => {
      draft.isIdentityModalOpen = false;
    });
  }, []);

  return {
    isIdentityModalOpen,
    openIdentityModal,
    closeIdentityModal,
  };
}

export function useUIControl() {
  const { setIsChatPanelOpen, isChatPanelOpen } = useContext(GameContext);

  return {
    isChatPanelOpen,
    setIsChatPanelOpen,
  };
}

export function useGameActions() {
  const gameRoom = useGameRoom();

  const kickPlayer = useCallback(
    (action: string) => {
      gameRoom?.send("kick-player", action);
    },
    [gameRoom]
  );

  const promoteGameLeader = useCallback(
    (action: string) => {
      gameRoom?.send("promote-game-leader", action);
    },
    [gameRoom]
  );

  const removeTrack = useCallback(
    (trackId: string) => {
      gameRoom?.send("remove-track", trackId);
    },
    [gameRoom]
  );

  const addTrack = useCallback(() => {
    gameRoom?.send("add-track");
  }, [gameRoom]);

  const changeTracksOrder = useCallback(
    (tracksIdx: string[]) => {
      gameRoom?.send("change-tracks-order", tracksIdx);
    },
    [gameRoom]
  );

  const takeTrackControl = useCallback(
    (tracksId: string) => {
      gameRoom?.send("update-track", {
        id: tracksId,
        playerId: gameRoom.sessionId,
      });
    },
    [gameRoom]
  );

  const leaveTrackControl = useCallback(
    (tracksId: string) => {
      gameRoom?.send("update-track", {
        id: tracksId,
        playerId: null,
      });
    },
    [gameRoom]
  );

  const selectTrackPatch = useCallback(
    (tracksId: string, patchId: string) => {
      gameRoom?.send("update-track", {
        id: tracksId,
        patch: patchId,
      });
    },
    [gameRoom]
  );

  const setTrackName = useCallback(
    (tracksId: string, name: string) => {
      gameRoom?.send("update-track", {
        id: tracksId,
        name,
      });
    },
    [gameRoom]
  );

  return {
    kickPlayer,
    promoteGameLeader,
    removeTrack,
    addTrack,
    changeTracksOrder,
    takeTrackControl,
    leaveTrackControl,
    selectTrackPatch,
    setTrackName,
  };
}
