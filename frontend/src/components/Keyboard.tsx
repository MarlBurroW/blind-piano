import { Panel } from "../components/Panel";
import { MidiContext } from "./context/MidiContext";
import { GameContext } from "./context/GameContext";
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  memo,
} from "react";
import SelectInput from "../components/form/inputs/SelectInput";
import { useTranslation } from "react-i18next";
import type { Input } from "webmidi";

import type { Note } from "webmidi";
import { KeyboardKeys, KeyboardKeysRef } from "./KeyboardKeys";
import { IPlayerNote } from "../types";
import SimpleBar from "simplebar-react";

export function Keyboard() {
  const { devices, selectedDevice, selectDevice } = useContext(MidiContext);
  const { gameRoom, me } = useContext(GameContext);

  const { t, i18n } = useTranslation();

  const deviceOptions: Array<{ value: Input | null; label: string }> =
    useMemo(() => {
      const result: Array<{ value: Input | null; label: string }> = devices.map(
        (d) => {
          return { value: d, label: d.name };
        }
      );

      result.unshift({ value: null, label: t("generic.select_midi_device") });

      return result;
    }, [devices, i18n.language]);

  const keyboardKeysRef = useRef<KeyboardKeysRef>(null);
  const previewKeyboardKeysRef = useRef<KeyboardKeysRef>(null);

  // Note received from other players

  useEffect(() => {
    const unbindNoteOnCallback = gameRoom?.onMessage(
      "noteon",
      (note: IPlayerNote) => {
        keyboardKeysRef.current?.setKeyState(note, true);
        previewKeyboardKeysRef.current?.setKeyState(note, true);
      }
    );

    const unbindNoteOffCallback = gameRoom?.onMessage(
      "noteoff",
      (note: IPlayerNote) => {
        keyboardKeysRef.current?.setKeyState(note, false);
        previewKeyboardKeysRef.current?.setKeyState(note, false);
      }
    );

    return () => {
      if (unbindNoteOnCallback) {
        unbindNoteOnCallback();
      }
      if (unbindNoteOffCallback) {
        unbindNoteOffCallback();
      }
    };
  }, [gameRoom, keyboardKeysRef.current, previewKeyboardKeysRef.current]);

  useEffect(() => {
    console.log("me or gameroom changed");
  }, [me, gameRoom]);

  // Note received from virtual keyboard

  const handleOnKeyDown = useCallback(
    (note: Note) => {
      gameRoom?.send("noteon", { number: note.number, attack: note.attack });

      if (me) {
        const playerNote = {
          number: note.number,
          attack: note.attack,
          playerId: me.id,
          color: me.color,
        };

        keyboardKeysRef.current?.setKeyState(playerNote, true);
        previewKeyboardKeysRef.current?.setKeyState(playerNote, true);
      }
    },
    [gameRoom, me]
  );

  const handleOnKeyUp = useCallback(
    (note: Note) => {
      gameRoom?.send("noteoff", { number: note.number });

      if (me) {
        const playerNote = {
          number: note.number,
          attack: note.attack,
          playerId: me.id,
          color: me.color,
        };
        keyboardKeysRef.current?.setKeyState(playerNote, false);
        previewKeyboardKeysRef.current?.setKeyState(playerNote, false);
      }
    },
    [gameRoom, me]
  );

  // Note received from midi keyboard

  useEffect(() => {
    selectedDevice?.addListener("noteon", (e) => {
      gameRoom?.send("noteon", {
        number: e.note.number,
        attack: e.note.attack,
      });

      if (me) {
        const playerNote = {
          number: e.note.number,
          attack: e.note.attack,
          playerId: me.id,
          color: me.color,
        };
        keyboardKeysRef.current?.setKeyState(playerNote, true);
        previewKeyboardKeysRef.current?.setKeyState(playerNote, true);
      }
    });

    selectedDevice?.addListener("noteoff", (e) => {
      gameRoom?.send("noteoff", { number: e.note.number });

      if (me) {
        const playerNote = {
          number: e.note.number,
          attack: e.note.attack,
          playerId: me.id,
          color: me.color,
        };
        keyboardKeysRef.current?.setKeyState(playerNote, false);
        previewKeyboardKeysRef.current?.setKeyState(playerNote, false);
      }
    });

    return () => {
      selectedDevice?.removeListener("noteon");
      selectedDevice?.removeListener("noteoff");
    };
  }, [
    selectedDevice,
    gameRoom,
    keyboardKeysRef.current,
    previewKeyboardKeysRef.current,
    me,
  ]);

  const MemoizedKeyboardKeys = memo(KeyboardKeys);

  return (
    <Panel>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <SelectInput
            onChange={selectDevice}
            value={selectedDevice}
            style="secondary"
            options={deviceOptions}
          ></SelectInput>
        </div>
        <div className="text-[0.2rem] flex justify-center overflow-hidden">
          <MemoizedKeyboardKeys
            ref={previewKeyboardKeysRef}
          ></MemoizedKeyboardKeys>
        </div>
        <SimpleBar autoHide={false} className=" h-[20em] ">
          <MemoizedKeyboardKeys
            ref={keyboardKeysRef}
            onKeyUp={handleOnKeyUp}
            onKeyDown={handleOnKeyDown}
          ></MemoizedKeyboardKeys>
        </SimpleBar>
      </div>
    </Panel>
  );
}
