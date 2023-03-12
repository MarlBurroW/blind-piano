import { KeyboardKey } from "./KeyboardKey";
import type { Note } from "webmidi";
import { Utilities } from "webmidi";
import {
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { IPlayerNote } from "../types";
import { useImmer } from "use-immer";
import { Player } from "../../../backend/schemas/Player";
import SimpleBar from "simplebar-react";

interface Props {
  onKeyDown: (note: Note) => void;
  onKeyUp: (note: Note) => void;
  me: Player | null;
}

export interface KeyboardKeysRef {
  setKeyState(note: IPlayerNote | Note, state: boolean): void;
}

type State = {
  keys: Array<{ active: { [key: string]: string } }>;
};

const initialState = {
  keys: Array.from(Array(128)).map((k) => {
    return {
      active: {},
    };
  }),
};

export const KeyboardKeys = forwardRef<KeyboardKeysRef | null, Props>(
  ({ onKeyDown, onKeyUp, me }: Props, ref) => {
    const notes = useMemo(() => {
      const midiNoteCodes = Array.from(Array(128).keys());
      return Utilities.buildNoteArray(midiNoteCodes);
    }, []);

    const [state, setState] = useImmer<State>(initialState);

    const setKeyState = useMemo(() => {
      return (note: IPlayerNote | Note, state: boolean) => {
        const { playerId, color } =
          "playerId" in note && "color" in note
            ? note
            : { playerId: me?.id, color: me?.color };

        if (!playerId || !color) {
          return;
        }

        setState((draft) => {
          const activePlayers = draft.keys[note.number].active;
          if (state) {
            activePlayers[playerId] = color;
          } else {
            delete activePlayers[playerId];
          }
        });
      };
    }, [me, setState]);

    const onInternalKeyDown = useCallback(
      (note: Note) => {
        if (me) {
          setKeyState(
            { playerId: me.id, number: note.number, color: me.color },
            true
          );
        }

        onKeyDown(note);
      },
      [me, onKeyDown]
    );

    const onInternalKeyUp = useCallback(
      (note: Note) => {
        // Call onKeyUp only if the state of the key state for me.playerId has a value

        if (me) {
          setKeyState(
            { playerId: me.id, number: note.number, color: me.color },
            false
          );
        }

        if (me && !state.keys[note.number].active[me.id]) {
          return;
        }

        onKeyUp(note);
      },
      [me, state, onKeyUp]
    );

    const [isMouseDown, setIsMouseDown] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        setKeyState,
      };
    });

    return (
      <div className="rounded-xl overflow-hidden">
        <SimpleBar
          onMouseLeave={() => setIsMouseDown(false)}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          autoHide={false}
          className="  h-64 "
        >
          <div className="flex transition-all   h-64 select-none pb-[2.5rem]">
            {notes.map((note) => {
              return (
                <KeyboardKey
                  key={note.number}
                  onKeyDown={onInternalKeyDown}
                  onKeyUp={onInternalKeyUp}
                  gliss={isMouseDown}
                  note={note}
                  state={state.keys[note.number]}
                ></KeyboardKey>
              );
            })}
          </div>
        </SimpleBar>
      </div>
    );
  }
);

export default KeyboardKeys;
