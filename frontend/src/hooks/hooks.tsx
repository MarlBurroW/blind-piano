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

export function usePlayerPatch(playerId: string | null): IPatch | null {
  const { playersPatches } = useContext(AudioContext);

  const patch = useMemo(() => {
    return playerId ? playersPatches.get(playerId) : null;
  }, [playersPatches, playerId]);

  return patch ? patch : null;
}

export function usePlayerMixerControl(playerId: string) {
  const { setPlayerVolume, playersVolumes } = useContext(AudioContext);

  const setVolume = useCallback(
    (value: number) => {
      return setPlayerVolume(playerId, value);
    },
    [playerId]
  );

  const volume = useMemo(() => {
    return playersVolumes.get(playerId);
  }, [playersVolumes, playerId]);

  return { setVolume, volume: volume ? volume : 0 };
}

export function useMasterMixerControl() {
  const { setMasterVolume, masterVolume } = useContext(AudioContext);

  const setVolume = useCallback(
    (value: number) => {
      return setMasterVolume(value);
    },
    [setMasterVolume]
  );

  const volume = useMemo(() => {
    return masterVolume;
  }, [masterVolume]);

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
    (device: Input) => {
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

export function useChat() {
  const { messages } = useContext(GameContext);
  const gameRoom = useGameRoom();

  const sendMessage = useCallback(
    (message: string) => {
      gameRoom?.send("chat-message", message);
    },
    [gameRoom]
  );

  return {
    messages,
    sendMessage,
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

export function usePlayers() {
  const { players } = useContext(GameContext);

  return players;
}

export function useTracks() {
  const { tracks } = useContext(GameContext);

  return tracks;
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

  return {
    kickPlayer,
    promoteGameLeader,
    removeTrack,
    addTrack,
    changeTracksOrder,
  };
}
