import { Panel } from "../components/Panel";
import { MidiContext } from "./context/MidiContext";
import { GameContext } from "./context/GameContext";
import { useContext, useEffect, useMemo, useRef } from "react";
import SelectInput from "../components/form/inputs/SelectInput";
import { useTranslation } from "react-i18next";
import type { Input } from "webmidi";

import type { Note } from "webmidi";
import { KeyboardKeys, KeyboardKeysRef } from "./KeyboardKeys";
import { IPlayerNote } from "../types";

export function Keyboard() {
  const { devices, selectedDevice, selectDevice } = useContext(MidiContext);
  const { gameRoom, me } = useContext(GameContext);

  const { t } = useTranslation();

  const deviceOptions: Array<{ value: Input | null; label: string }> =
    useMemo(() => {
      const result: Array<{ value: Input | null; label: string }> = devices.map(
        (d) => {
          return { value: d, label: d.name };
        }
      );

      result.unshift({ value: null, label: t("generic.select_midi_device") });

      return result;
    }, [devices]);

  const keyboardKeysRef = useRef<KeyboardKeysRef>(null);

  // Note received from other players

  useEffect(() => {
    const unbindNoteOnCallback = gameRoom?.onMessage(
      "noteon",
      (note: IPlayerNote) => {
        keyboardKeysRef.current?.setKeyState(note, true);
      }
    );

    const unbindNoteOffCallback = gameRoom?.onMessage(
      "noteoff",
      (note: IPlayerNote) => {
        keyboardKeysRef.current?.setKeyState(note, false);
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
  }, [gameRoom, keyboardKeysRef.current]);

  // Note received from virtual keyboard

  const handleOnKeyDown = (note: Note) => {
    gameRoom?.send("noteon", { number: note.number, attack: note.attack });
  };

  const handleOnKeyUp = (note: Note) => {
    gameRoom?.send("noteoff", { number: note.number });
  };

  // Note received from midi keyboard

  useEffect(() => {
    selectedDevice?.addListener("noteon", (e) => {
      keyboardKeysRef.current?.setKeyState(e.note, true);
      gameRoom?.send("noteon", {
        number: e.note.number,
        attack: e.note.attack,
      });
    });

    selectedDevice?.addListener("noteoff", (e) => {
      keyboardKeysRef.current?.setKeyState(e.note, false);
      gameRoom?.send("noteoff", { number: e.note.number });
    });

    return () => {
      selectedDevice?.removeListener("noteon");
      selectedDevice?.removeListener("noteoff");
    };
  }, [selectedDevice, gameRoom, keyboardKeysRef.current]);

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

        <KeyboardKeys
          me={me ? me : null}
          ref={keyboardKeysRef}
          onKeyUp={handleOnKeyUp}
          onKeyDown={handleOnKeyDown}
        ></KeyboardKeys>
      </div>
    </Panel>
  );
}
