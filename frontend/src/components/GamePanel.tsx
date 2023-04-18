import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { Reorder } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useElementSize } from "usehooks-ts";

import { ITrack } from "../../../common/types";
import { Panel } from "../components/Panel";
import { Button } from "../components/form/Button";
import { useGameActions, useGameRoom, useTracks } from "../hooks/hooks";
import { MasterVolumeSlider } from "./MasterVolumeSlider";
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
      <div
        className="bg-shade-300 py-2 px-5 flex items-center justify-between"
        ref={squareRef}
      >
        <Button size="sm" onClick={addTrack}>
          Add track
        </Button>
        <div className=" flex items-center">
          <div className="whitespace-nowrap mr-5">
            {t("generic.master_volume")}
          </div>
          <SpeakerXMarkIcon className="h-8 w-8 mr-4" />
          <div className="w-[25rem]">
            <MasterVolumeSlider></MasterVolumeSlider>
          </div>
          <SpeakerWaveIcon className="h-8 w-8 ml-4" />
        </div>
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
        className="overflow-x-hidden bg-shade-700 w-[20rem]"
        style={{ height: `calc(100% - ${height}px)`, overflowY: "scroll" }}
        axis="y"
        values={movableTracks}
        onReorder={changeOrder}
      >
        {movableTracks.map((track, index) => {
          return <TrackHead key={track.id} onClick={editTrack} track={track} />;
        })}
      </Reorder.Group>
    </Panel>
  );
}

export default GamePanel;
