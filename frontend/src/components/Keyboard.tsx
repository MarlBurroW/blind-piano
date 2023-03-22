import { Panel } from "../components/Panel";
import { MidiContext } from "./context/MidiContext";
import { GameContext } from "./context/GameContext";
import { getInstrumentItemFromIdentifier } from "./context/AudioContext";
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
import { IPlayerNote, IInstrumentItem } from "../types";

import { SelectInstrumentModal } from "./modals/SelectInstrumentModal";
import { Button } from "./form/Button";

export function Keyboard() {
  const { devices, selectedDevice, selectDevice, midiBus$ } =
    useContext(MidiContext);
  const { gameRoom, me } = useContext(GameContext);

  const [selectInstrumentModalOpen, setSelectIntrumentModalOpen] =
    useState(false);

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

    midiBus$?.on("noteon", noteOn);
    midiBus$?.on("noteoff", noteOff);

    return () => {
      midiBus$?.off("noteon", noteOn);
      midiBus$?.off("noteoff", noteOff);
    };
  }, [midiBus$, keyboardKeysRef.current, previewKeyboardKeysRef.current]);

  // Note received from virtual keyboard

  const handleOnKeyDown = useCallback(
    (note: Note) => {
      gameRoom?.send("noteon", {
        number: note.number,
        attack: note.attack,
        release: note.release,
        name: note.identifier,
      });
      console.log(note);
      if (me) {
        const playerNote: IPlayerNote = {
          number: note.number,
          velocity: 1,
          name: note.identifier,
          playerId: me.id,
          color: me.color,
        };
        midiBus$?.emit("noteon", playerNote);
      }
    },
    [gameRoom, me]
  );

  const handleOnKeyUp = useCallback(
    (note: Note) => {
      gameRoom?.send("noteoff", {
        number: note.number,
        release: note.release,
        name: note.identifier,
      });

      if (me) {
        const playerNote: IPlayerNote = {
          number: note.number,
          velocity: 0,
          name: note.identifier,
          playerId: me.id,
          color: me.color,
        };
        midiBus$?.emit("noteoff", playerNote);
      }
    },
    [gameRoom, me]
  );

  const currentInstrumentItem: IInstrumentItem | null = useMemo(() => {
    return me ? getInstrumentItemFromIdentifier(me.instrument) : null;
  }, [me?.instrument]);

  useEffect(() => {
    selectedDevice?.addListener("noteon", (e) => {
      gameRoom?.send("noteon", {
        number: e.note.number,
        name: e.note.identifier,
        velocity: e.velocity,
      });

      console.log(e);

      if (me) {
        const playerNote: IPlayerNote = {
          number: e.note.number,
          velocity: e.velocity,
          name: e.note.identifier,
          playerId: me.id,
          color: me.color,
        };
        midiBus$?.emit("noteon", playerNote);
      }
    });

    selectedDevice?.addListener("noteoff", (e) => {
      gameRoom?.send("noteoff", {
        number: e.note.number,
        name: e.note.identifier,
      });

      if (me) {
        const playerNote: IPlayerNote = {
          number: e.note.number,
          velocity: e.velocity,
          name: e.note.identifier,
          playerId: me.id,
          color: me.color,
        };
        midiBus$?.emit("noteoff", playerNote);
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

  const handleInstrumentChange = useCallback(
    (instrumentIdentifier: string) => {
      gameRoom?.send("setInstrument", instrumentIdentifier);
    },
    [gameRoom]
  );

  return (
    <Panel>
      <div className="flex flex-col h-full">
        <div className="flex w-full mb-2 gap-8">
          <div className="w-[20rem]">
            <SelectInput
              onChange={selectDevice}
              value={selectedDevice}
              style="secondary"
              options={deviceOptions}
            ></SelectInput>
          </div>
          <div className="w-[20rem]">
            {me ? (
              <Button
                size="md"
                style="secondary"
                type="button"
                fullWidth={false}
                className="mx-auto"
                onClick={() => setSelectIntrumentModalOpen(true)}
              >
                {currentInstrumentItem ? currentInstrumentItem.name : "Select"}
              </Button>
            ) : (
              ""
            )}
          </div>

          <div className="text-[0.2rem]">
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

              <div className="z-0 relative pointer-events-none">
                <KeyboardKeys ref={previewKeyboardKeysRef}></KeyboardKeys>
              </div>
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
      <SelectInstrumentModal
        isOpen={selectInstrumentModalOpen}
        onClose={() => setSelectIntrumentModalOpen(false)}
      ></SelectInstrumentModal>
    </Panel>
  );
}
