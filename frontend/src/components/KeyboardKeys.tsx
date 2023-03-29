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
  memo,
} from "react";
import { IPlayerNote } from "../types";
import { useImmer } from "use-immer";
import _ from "lodash";

const KEY_START = 21;
const KEY_END = 108;

type TColor = string;

type State = {
  keys: IKeysState;
  updateCount: number;
};
interface Props {
  onKeyDown?: (note: Note) => void;
  onKeyUp?: (note: Note) => void;
}
interface IActiveKeys {
  [playerId: string]: TColor;
}
interface IKeysState {
  [key: number]: {
    active: IActiveKeys;
  };
}
export interface KeyboardKeysRef {
  setKeyState(note: IPlayerNote, state: boolean): void;
  resetAllPlayerKeys(playerId: string): void;
}

const keysState: IKeysState = {};

for (let i = KEY_START; i <= KEY_END; i++) {
  keysState[i] = {
    active: {},
  };
}

const initialState = {
  keys: keysState,
  updateCount: 0,
};

function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
}

export const KeyboardKeys = forwardRef<KeyboardKeysRef | null, Props>(
  ({ onKeyDown, onKeyUp }: Props, ref) => {
    const notes = useMemo(() => {
      const midiNoteCodes = range(KEY_START, KEY_END);
      return Utilities.buildNoteArray(midiNoteCodes);
    }, []);

    const [state, setState] = useImmer<State>(initialState);
    const isMouseDownRef = useRef(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
      isMouseDownRef.current = isMouseDown;
    }, [isMouseDown]);

    const resetAllPlayerKeys = useMemo(() => {
      return (playerId: string) => {
        setState((draft) => {
          draft.updateCount += 1;

          for (let i = KEY_START; i <= KEY_END; i++) {
            const activePlayers = draft.keys[i].active;
            delete activePlayers[playerId];
          }
        });
      };
    }, [setState]);

    const setKeyState = useMemo(() => {
      return (note: IPlayerNote, state: boolean) => {
        const { playerId, color } = note;

        setState((draft) => {
          if (!draft.keys[note.number]) return;

          draft.updateCount += 1;

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
        resetAllPlayerKeys,
      };
    });

    const MemoizedKeys = useMemo(() => {
      return notes.map((note, index) => {
        return (
          <KeyboardKey
            key={note.number}
            onMouseDown={onInternalKeyDown}
            onMouseUp={onInternalKeyUp}
            onMouseEnter={onInternalKeyDown}
            onMouseLeave={onInternalKeyUp}
            latestNote={index == notes.length - 1}
            note={note}
            state={state.keys[note.number]}
          ></KeyboardKey>
        );
      });
    }, [state.updateCount, onInternalKeyDown, onInternalKeyUp]);

    return (
      <div
        onMouseLeave={() => setIsMouseDown(false)}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        className="rounded-xl"
      >
        <div className="flex transition-all   h-[20em] select-none ">
          {MemoizedKeys}
        </div>
      </div>
    );
  }
);

export default KeyboardKeys;
