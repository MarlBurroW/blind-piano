import Player from "../../../backend/schemas/Player";
import { useContext, useCallback, useMemo, useEffect } from "react";
import { useMidiBus } from "../hooks/hooks";

import { useImmer } from "use-immer";
import { IPlayerNote } from "../types";
import { MidiContext } from "./context/MidiContext";
import { v4 as uuidv4 } from "uuid";

interface Props {
  player: Player;
}

interface State {
  latestPlayedNotes: {
    [key: string]: IPlayerNote;
  };
}

export function NoteBubbleEmitter({ player }: Props) {
  const midiBus = useMidiBus();

  const [state, setState] = useImmer<State>({
    latestPlayedNotes: {},
  });

  const handleNoteOn = useCallback(
    (note: IPlayerNote) => {
      if (player.id !== note.playerId) return;

      const id = uuidv4();

      setState((draft) => {
        draft.latestPlayedNotes[id] = note;
      });

      const timeout = setTimeout(() => {
        setState((draft) => {
          delete draft.latestPlayedNotes[id];
        });

        clearTimeout(timeout);
      }, 2000);
    },
    [player, setState]
  );

  useEffect(() => {
    midiBus?.on("noteon", handleNoteOn);

    return () => {
      midiBus?.off("noteon", handleNoteOn);
    };
  }, [midiBus, player]);

  return (
    <div className="note-bubbles absolute w-full h-full left-0 top-0 bottom-0">
      {Object.keys(state.latestPlayedNotes).map((key) => {
        return (
          <div
            key={key}
            style={{ backgroundColor: player.color, top: "0%" }}
            className="note-bubble absolute h-12 w-12 rounded-full flex justify-center items-center"
          >
            {state.latestPlayedNotes[key].name}
          </div>
        );
      })}
    </div>
  );
}
