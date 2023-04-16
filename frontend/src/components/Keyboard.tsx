import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useTranslation } from "react-i18next";
import type { Input } from "webmidi";
import type { Note } from "webmidi";
import { NoteMessageEvent } from "webmidi";

import { IPlayer, IPlayerNote, ITransportNote } from "../../../common/types";
import { Panel } from "../components/Panel";
import SelectInput from "../components/form/inputs/SelectInput";
import { useGameRoom, useMe, useMidiBus, useMidiDevices } from "../hooks/hooks";
import { KeyboardKeys, KeyboardKeysRef } from "./KeyboardKeys";
import { MixerModal } from "./modals/MixerModal";

function transportNoteFromMidiNote(note: Note): ITransportNote {
  return {
    number: note.number,
    name: note.identifier,
    velocity: note.attack,
  };
}

function playerNoteFromMidiNote(note: Note, player: IPlayer): IPlayerNote {
  return {
    number: note.number,
    name: note.identifier,
    velocity: note.attack,
    playerId: player.id,
    color: player.color,
  };
}

export function Keyboard() {
  const { midiDevices, selectedMidiDevice, selectMidiDevice } =
    useMidiDevices();

  const midiBus = useMidiBus();
  const me = useMe();
  const gameRoom = useGameRoom();

  const [mixerModalOpen, setMixerModalOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const deviceOptions: Array<{ value: Input | null; label: string }> =
    useMemo(() => {
      const result: Array<{ value: Input | null; label: string }> =
        midiDevices.map(d => {
          return { value: d, label: d.name };
        });

      result.unshift({ value: null, label: t("generic.select_midi_device") });

      return result;
    }, [midiDevices, i18n.language]);

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
    const unbind = gameRoom?.onMessage("player-left", (player: IPlayer) => {
      keyboardKeysRef.current?.resetAllPlayerKeys(player.id);
      previewKeyboardKeysRef.current?.resetAllPlayerKeys(player.id);
    });

    return () => {
      unbind?.();
    };
  }, [gameRoom]);

  useEffect(() => {
    scrollbarRef.current?.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    const target = scrollbarRef.current;

    // Set scroll to 50% to center the keyboard
    target?.scrollTo(
      (target.scrollWidth - target.clientWidth) / 2,
      target.scrollTop
    );

    updateScrollState();
    return () => {
      window.removeEventListener("resize", updateScrollState);
      scrollbarRef.current?.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  // Note received from the players MIDI BUS

  useEffect(() => {
    function noteOn(note: IPlayerNote) {
      keyboardKeysRef.current?.setKeyState(note, true);
      previewKeyboardKeysRef.current?.setKeyState(note, true);
    }

    function noteOff(note: IPlayerNote) {
      keyboardKeysRef.current?.setKeyState(note, false);
      previewKeyboardKeysRef.current?.setKeyState(note, false);
    }

    midiBus?.on("noteon", noteOn);
    midiBus?.on("noteoff", noteOff);

    return () => {
      midiBus?.off("noteon", noteOn);
      midiBus?.off("noteoff", noteOff);
    };
  }, [midiBus, keyboardKeysRef.current, previewKeyboardKeysRef.current]);

  // Note received from virtual keyboard

  const handleOnKeyDown = useCallback(
    (note: Note) => {
      gameRoom?.send("noteon", transportNoteFromMidiNote(note));

      if (me) {
        const playerNote: IPlayerNote = playerNoteFromMidiNote(note, me);
        midiBus?.emit("noteon", playerNote);
      }
    },
    [gameRoom, me]
  );

  const handleOnKeyUp = useCallback(
    (note: Note) => {
      gameRoom?.send("noteoff", transportNoteFromMidiNote(note));

      if (me) {
        const playerNote: IPlayerNote = playerNoteFromMidiNote(note, me);
        midiBus?.emit("noteoff", playerNote);
      }
    },
    [gameRoom, me]
  );

  useEffect(() => {
    selectedMidiDevice?.addListener("noteon", (e: NoteMessageEvent) => {
      const transportNote: ITransportNote = transportNoteFromMidiNote(e.note);
      gameRoom?.send("noteon", transportNote);

      if (me) {
        const playerNote: IPlayerNote = playerNoteFromMidiNote(e.note, me);
        midiBus?.emit("noteon", playerNote);
      }
    });

    selectedMidiDevice?.addListener("noteoff", e => {
      gameRoom?.send("noteoff", transportNoteFromMidiNote(e.note));

      if (me) {
        const playerNote: IPlayerNote = playerNoteFromMidiNote(e.note, me);
        midiBus?.emit("noteoff", playerNote);
      }
    });

    return () => {
      selectedMidiDevice?.removeListener("noteon");
      selectedMidiDevice?.removeListener("noteoff");
    };
  }, [
    selectedMidiDevice,
    gameRoom,
    keyboardKeysRef.current,
    previewKeyboardKeysRef.current,
    me,
  ]);

  function onDrag(event: DraggableEvent, data: DraggableData) {
    const scrollLeftPercentage =
      (data.x / scrollState.previewContainerWidth) * 100;

    const scrollLeft =
      (scrollLeftPercentage / 100) * scrollState.containerWidth;

    scrollbarRef.current?.scrollTo(scrollLeft, 0);
  }

  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      const containerRect = overlayRef.current.getBoundingClientRect();
      const containerStartX = containerRect.left;
      const clickX = e.clientX;
      const positionInLength =
        ((clickX - containerStartX) / containerRect.width) * 100;

      const scrollPosition =
        (positionInLength / 100) * scrollState.containerWidth -
        ((scrollState.visiblePercentage / 100) * scrollState.containerWidth) /
          2;

      scrollbarRef.current?.scrollTo({
        left: scrollPosition,
        top: 0,
        behavior: "smooth",
      });

      updateScrollState();
    }
  };

  return (
    <Panel>
      <div className="flex flex-col h-full relative">
        <div className="flex w-full mb-2 gap-8  items-center">
          <div className="min-w-[30rem]">
            <SelectInput
              onChange={selectMidiDevice}
              value={selectedMidiDevice}
              style="secondary"
              options={deviceOptions}
            ></SelectInput>
          </div>

          <div className="flex-grow"></div>

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
                className="absolute z-[4] h-full cursor-ew-resize top-0  hover:ring-4 ring-secondary-500"
              ></div>
            </Draggable>
            <div
              onClick={handleOverlayClick}
              ref={overlayRef}
              style={{
                clipPath: scrollState.clipPathPolygon,
              }}
              className="overlay absolute   top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50 z-[3]"
            ></div>

            <div className="z-0 relative pointer-events-none text-[0.17rem]">
              <KeyboardKeys ref={previewKeyboardKeysRef}></KeyboardKeys>
            </div>
          </div>
        </div>

        <div
          ref={scrollbarRef}
          className="h-[20em] overflow-x-scroll overflow-y-hidden relative"
        >
          <KeyboardKeys
            ref={keyboardKeysRef}
            onKeyUp={handleOnKeyUp}
            onKeyDown={handleOnKeyDown}
          ></KeyboardKeys>
        </div>
      </div>
    </Panel>
  );
}
