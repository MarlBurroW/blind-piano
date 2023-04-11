import { Reorder } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useElementSize } from "usehooks-ts";

import { ITrack } from "../../../common/types";
import { Panel } from "../components/Panel";
import { Button } from "../components/form/Button";
import { useGameActions, useGameRoom, useTracks } from "../hooks/hooks";
import { TrackHead } from "./TrackHead";
import { TrackModal } from "./modals/TrackModal";

export function GamePanel() {
  const gameRoom = useGameRoom();
  const tracks = useTracks();
  const [squareRef, { height }] = useElementSize();

  const { t } = useTranslation();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const [trackToEdit, setTrackToEdit] = useState<ITrack | null>(null);

  const { addTrack, changeTracksOrder } = useGameActions();

  const [movableTracks, setMovableTracks] = useState<ITrack[]>(tracks);

  const editTrack = useCallback(
    (track: ITrack) => {
      setTrackToEdit(track);
      setIsTrackModalOpen(true);
    },
    [setTrackToEdit, setIsTrackModalOpen]
  );

  useEffect(() => {
    setMovableTracks(tracks);
  }, [tracks]);

  const changeOrder = useCallback(
    (tracks: ITrack[]) => {
      setMovableTracks(tracks);
      changeTracksOrder(tracks.map(t => t.id));
    },
    [movableTracks]
  );

  return (
    <Panel padding={0} className="h-full mb-4 overflow-y-hidden">
      <div className="bg-shade-300 p-2" ref={squareRef}>
        <Button size="sm" onClick={addTrack}>
          Add track
        </Button>
      </div>
      <TrackModal
        track={trackToEdit}
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setTimeout(() => {
            setTrackToEdit(null);
          }, 300);
        }}
        onSubmit={track => {
          gameRoom?.send("create-update-track", track);
        }}
      />

      <Reorder.Group
        className="overflow-y-scroll overflow-x-hidden"
        style={{ height: `calc(100% - ${height}px)` }}
        axis="y"
        values={movableTracks}
        onReorder={changeOrder}
      >
        {movableTracks.map((track, index) => {
          return (
            <Reorder.Item
              initial={{ x: -500 }}
              animate={{ x: 0 }}
              exit={{ x: -500 }}
              key={track.id}
              value={track}
            >
              <TrackHead onClick={editTrack} track={track} />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </Panel>
  );
}

export default GamePanel;
