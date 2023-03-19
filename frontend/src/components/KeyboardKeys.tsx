import { KeyboardKey } from "./KeyboardKey";
import type { Note } from "webmidi";
import { Utilities } from "webmidi";
import {
  useMemo,
  useState,
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { IPlayerNote } from "../types";
import { useImmer } from "use-immer";

interface Props {
  onKeyDown?: (note: Note) => void;
  onKeyUp?: (note: Note) => void;
}

export interface KeyboardKeysRef {
  setKeyState(note: IPlayerNote, state: boolean): void;
}

type State = {
  keys: Array<{ active: { [key: string]: string } }>;
};

const KEYS_NUMBER = 128;

const initialState = {
  keys: Array.from(Array(KEYS_NUMBER)).map((k) => {
    return {
      active: {},
    };
  }),
};

export const KeyboardKeys = forwardRef<KeyboardKeysRef | null, Props>(
  ({ onKeyDown, onKeyUp }: Props, ref) => {
    const notes = useMemo(() => {
      const midiNoteCodes = Array.from(Array(KEYS_NUMBER).keys());
      return Utilities.buildNoteArray(midiNoteCodes);
    }, []);

    const [state, setState] = useImmer<State>(initialState);
    const isMouseDownRef = useRef(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
      isMouseDownRef.current = isMouseDown;
    }, [isMouseDown]);

    useEffect(() => {
      console.log("isMouseDown changed");
    }, [isMouseDown]);

    console.log("render keyboardKeys");

    const setKeyState = useMemo(() => {
      return (note: IPlayerNote, state: boolean) => {
        const { playerId, color } = note;

        setState((draft) => {
          const activePlayers = draft.keys[note.number].active;
          if (state) {
            activePlayers[playerId] = color;
          } else {
            delete activePlayers[playerId];
          }
        });
      };
    }, [setState]);

    const onInternalKeyDown = useCallback(
      (note: Note, gliss?: boolean) => {
        if (gliss && !isMouseDownRef.current) return;

        onKeyDown ? onKeyDown(note) : null;
      },
      [onKeyDown]
    );

    const onInternalKeyUp = useCallback(
      (note: Note, gliss?: boolean) => {
        if (gliss && !isMouseDownRef.current) return;

        onKeyUp ? onKeyUp(note) : null;
      },
      [onKeyUp]
    );

    useImperativeHandle(ref, () => {
      return {
        setKeyState,
      };
    });

    return (
      <div
        onMouseLeave={() => setIsMouseDown(false)}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        className="rounded-xl"
      >
        <div className="flex transition-all   h-[20em] select-none pb-[2.5em]">
          {notes.map((note) => {
            return (
              <KeyboardKey
                key={note.number}
                onMouseDown={onInternalKeyDown}
                onMouseUp={onInternalKeyUp}
                onMouseEnter={onInternalKeyDown}
                onMouseLeave={onInternalKeyUp}
                note={note}
                state={state.keys[note.number]}
              ></KeyboardKey>
            );
          })}
        </div>
      </div>
    );
  }
);

export default KeyboardKeys;
