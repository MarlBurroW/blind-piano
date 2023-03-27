import { useContext, useCallback, useRef, useMemo, useState } from "react";
import { MidiContext } from "../components/context/MidiContext";
import { AudioContext } from "../components/context/AudioContext";
import { GameContext } from "../components/context/GameContext";
import type { Input } from "webmidi";
import { IInstrument } from "../../../common/types";
import { colors } from "../../../common/colors";

export function useMidiBus() {
  const { midiBus$ } = useContext(MidiContext);

  return midiBus$;
}

export function usePlayerInstrument(
  playerId: string | null
): IInstrument | null {
  const { playersInstruments } = useContext(AudioContext);

  const instrument = useMemo(() => {
    return playerId ? playersInstruments[playerId] : null;
  }, [playersInstruments, playerId]);

  return instrument;
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
    return playersVolumes[playerId];
  }, [playersVolumes, playerId]);

  return { setVolume, volume };
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

export function useGameRoom() {
  const { gameRoom } = useContext(GameContext);

  return gameRoom;
}

export function useIntrumentItems() {
  const { instrumentItems } = useContext(AudioContext);

  return instrumentItems;
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

export function useSelectInstrument() {
  const gameRoom = useGameRoom();

  const selectInstrument = useCallback(
    (instrumentIdentifier: string) => {
      if (gameRoom) {
        gameRoom.send("set-instrument", instrumentIdentifier);
      }
    },
    [gameRoom]
  );

  return selectInstrument;
}

export function usePlayers() {
  const { players } = useContext(GameContext);

  return players;
}

export function useColors() {
  const players = usePlayers();
  const me = useMe();

  const availableColors = useMemo(() => {
    const allPlayersExceptMe = players.filter((player) => player.id !== me?.id);

    return colors.filter((color) => {
      return !allPlayersExceptMe.find((player) => player.color === color);
    });
  }, [players]);

  return {
    colors,
    availableColors,
  };
}
