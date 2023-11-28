import React, { useCallback, useContext, useState } from "react";
import { useImmer } from "use-immer";

import { ITrack, TimeSignature } from "../../../../common/types";
import { useGameActions, useTracks } from "../../hooks/hooks";
import { GameContext } from "./GameContext";

interface ISequencerContext {
  tracks: ITrack[];
  timeSignature: TimeSignature;
  changeTracksOrder: (trackIdx: string[]) => void;
  addTrack: () => void;
  changeOrder: (tracks: ITrack[]) => void;
}

const initialContextValues: ISequencerContext = {
  tracks: [],
  timeSignature: "4/4",
  changeTracksOrder: () => {},
  addTrack: () => {},
  changeOrder: () => {},
};

export const SequencerContext =
  React.createContext<ISequencerContext>(initialContextValues);

export function SequencerProvider({ children }: { children: React.ReactNode }) {
  const { addTrack, changeTracksOrder } = useGameActions();

  const tracks = useTracks();

  const { sequencer } = useContext(GameContext);

  const timeSignature = sequencer?.timeSignature || "4/4";

  const [orderedTracks, setOrderedTracks] = useState<ITrack[]>(tracks);

  const changeOrder = useCallback(
    (tracks: ITrack[]) => {
      setOrderedTracks(tracks);
      changeTracksOrder(tracks.map(t => t.id));
    },
    [orderedTracks]
  );

  return (
    <SequencerContext.Provider
      value={{
        tracks: orderedTracks,
        timeSignature,
        changeTracksOrder,
        addTrack,
        changeOrder,
      }}
    >
      {children}
    </SequencerContext.Provider>
  );
}
