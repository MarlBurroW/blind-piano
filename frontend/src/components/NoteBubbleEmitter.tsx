import { useCallback, useEffect } from "react";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";

import { IPlayer, IPlayerNote } from "../../../common/types";
import { useMidiBus } from "../hooks/hooks";

interface Props {
  player: IPlayer;
}

interface State {
  latestPlayedNotes: {
    [key: string]: {
      top: number;
      note: IPlayerNote;
    };
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

      setState(draft => {
        draft.latestPlayedNotes[id] = {
          top: Math.random() * 50,
          note,
        };
      });

      const timeout = setTimeout(() => {
        setState(draft => {
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
    <div className="note-bubbles absolute w-full h-full left-0 top-0 bottom-0 pointer-events-none select-none">
      {Object.keys(state.latestPlayedNotes).map(key => {
        return (
          <div
            key={key}
            style={{
              backgroundColor: player.color,
              top: `${state.latestPlayedNotes[key].top}%`,
            }}
            className="note-bubble absolute h-12 w-12 rounded-full flex justify-center items-center"
          >
            {state.latestPlayedNotes[key].note.name}
          </div>
        );
      })}
    </div>
  );
}
