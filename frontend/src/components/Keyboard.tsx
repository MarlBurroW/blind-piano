import { Panel } from "../components/Panel";
import { MidiContext } from "./context/MidiContext";
import { GameContext } from "./context/GameContext";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  memo,
  useState,
} from "react";
import SelectInput from "../components/form/inputs/SelectInput";
import { useTranslation } from "react-i18next";
import type { Input } from "webmidi";

import type { Note } from "webmidi";
import { KeyboardKeys, KeyboardKeysRef } from "./KeyboardKeys";
import { IPlayerNote } from "../types";
import SimpleBar from "simplebar-react";

export function Keyboard() {
  const { devices, selectedDevice, selectDevice, midiBus$ } =
    useContext(MidiContext);
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
  const scrollbarRef = useRef<HTMLDivElement | null>(null);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  interface ScrollState {
    visiblePercentage: number;
    leftPercentage: number;
    scrollPercentage: number;
    previewContainerWidth: number;
    previewContainerLeft: number;
    previewSliderWidth: number;
    containerWidth: number;
    clipPathPolygon: string;
  }

  const [scrollState, setScrollState] = useState<ScrollState>({
    visiblePercentage: 0,
    leftPercentage: 0,
    scrollPercentage: 0,
    previewContainerWidth: 0,
    previewContainerLeft: 0,
    previewSliderWidth: 0,
    containerWidth: 0,
    clipPathPolygon: "0 0, 0 0, 0 0, 0 0",
  });

  function updateScrollState() {
    const target = scrollbarRef.current;

    const leftPercentage = target
      ? (target.scrollLeft / target.scrollWidth) * 100
      : 0;
    const previewContainerWidth = previewContainerRef.current?.clientWidth || 0;
    const previewContainerLeft = (leftPercentage / 100) * previewContainerWidth;
    const visiblePercentage = target
      ? (target?.clientWidth / target?.scrollWidth) * 100
      : 0;
    const scrollPercentage = target
      ? (target.scrollLeft / (target.scrollWidth - target.clientWidth)) * 100
      : 0;

    const previewSliderWidth =
      previewContainerWidth * (visiblePercentage / 100);

    const containerWidth = target?.scrollWidth || 0;

    const clipPathPolygon = `polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      ${leftPercentage + visiblePercentage}% 100%,
      ${leftPercentage + visiblePercentage}% 0%,
      ${leftPercentage}% 0%,
      ${leftPercentage}% 100%,
      0% 100%
    )`;

    setScrollState({
      previewContainerWidth,
      previewContainerLeft,
      containerWidth,
      visiblePercentage,
      leftPercentage,
      scrollPercentage,
      previewSliderWidth,
      clipPathPolygon,
    });
  }

  useEffect(() => {
    scrollbarRef.current?.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    updateScrollState();
    return () => {
      window.removeEventListener("resize", updateScrollState);
      scrollbarRef.current?.removeEventListener("scroll", updateScrollState);
    };
  }, []);

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
        midiBus$?.emit("noteon", playerNote);
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
        midiBus$?.emit("noteoff", playerNote);
        keyboardKeysRef.current?.setKeyState(playerNote, false);
        previewKeyboardKeysRef.current?.setKeyState(playerNote, false);
      }
    },
    [gameRoom, me]
  );

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
        midiBus$?.emit("noteon", playerNote);
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
        midiBus$?.emit("noteoff", playerNote);
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

  function onDrag(event: DraggableEvent, data: DraggableData) {
    const scrollLeftPercentage =
      (data.x / scrollState.previewContainerWidth) * 100;

    const scrollLeft =
      (scrollLeftPercentage / 100) * scrollState.containerWidth;

    scrollbarRef.current?.scrollTo(scrollLeft, 0);
  }

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
        <div className="text-[0.2rem] flex  overflow-hidden mb-2">
          <div className="relative" ref={previewContainerRef}>
            <Draggable
              axis="x"
              bounds="parent"
              onDrag={onDrag}
              position={{
                x: scrollState.previewContainerLeft,
                y: 0,
              }}
              defaultPosition={{ x: 0, y: 0 }}
            >
              <div
                style={{
                  width: `${scrollState.visiblePercentage}%`,
                }}
                className="absolute z-[4]  h-full cursor-ew-resize top-0"
              ></div>
            </Draggable>
            <div
              style={{
                clipPath: scrollState.clipPathPolygon,
              }}
              className="overlay absolute  top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50 z-[3]"
            ></div>

            <div className="z-0 relative">
              <MemoizedKeyboardKeys
                ref={previewKeyboardKeysRef}
              ></MemoizedKeyboardKeys>
            </div>
          </div>
        </div>

        <div
          ref={scrollbarRef}
          className="h-[20em] overflow-x-scroll overflow-y-hidden relative"
        >
          <MemoizedKeyboardKeys
            ref={keyboardKeysRef}
            onKeyUp={handleOnKeyUp}
            onKeyDown={handleOnKeyDown}
          ></MemoizedKeyboardKeys>
        </div>
      </div>
    </Panel>
  );
}
