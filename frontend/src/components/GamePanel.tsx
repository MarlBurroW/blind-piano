import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { Reorder } from "framer-motion";
import React, {
  DragEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Resizable, ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { Tooltip } from "react-tooltip";
import { useElementSize } from "usehooks-ts";

import { ITrack } from "../../../common/types";
import { Panel } from "../components/Panel";
import { Button } from "../components/form/Button";
import { useGameActions, useGameRoom, useTracks } from "../hooks/hooks";
import { MasterVolumeSlider } from "./MasterVolumeSlider";
import SequencerHeader from "./SequencerHeader";
import { TimeGrid } from "./TimeGrid";
import { TrackHead } from "./TrackHead";
import { SequencerProvider } from "./context/SequencerContext";
import { SequencerContext } from "./context/SequencerContext";
import { TrackModal } from "./modals/TrackModal";

export function GamePanel() {
  const gameRoom = useGameRoom();
  const tracks = useTracks();
  const [topBarRef, { height: topBarHeight }] = useElementSize();
  const [panelRef, { height: panelHeight }] = useElementSize();

  const MIN_WIDTH = 300; // par exemple, 100 pixels
  const MAX_WIDTH = 800; // par exemple, 500 pixels

  const { t } = useTranslation();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const [trackToEdit, setTrackToEdit] = useState<ITrack | null>(null);

  const { addTrack, changeTracksOrder, changeOrder } =
    useContext(SequencerContext);

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

  const [initialPos, setInitialPos] = useState<number | null>(null);
  const [initialSize, setInitialSize] = useState<number | null>(null);
  const resizableRef = useRef<HTMLDivElement>(null);

  const [resizing, setResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    setInitialPos(e.clientX);
    let resizable = resizableRef.current;
    if (resizable) {
      setInitialSize(resizable.offsetWidth);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizing || initialPos === null || initialSize === null) return;
    const deltaX = e.clientX - initialPos;
    let newWidth = initialSize + deltaX;

    // Appliquer les limites
    if (newWidth < MIN_WIDTH) {
      newWidth = MIN_WIDTH;
    } else if (newWidth > MAX_WIDTH) {
      newWidth = MAX_WIDTH;
    }

    let resizable = resizableRef.current;
    if (resizable) {
      resizable.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  return (
    <Panel padding={0} className="h-full mb-4 overflow-y-hidden flex flex-col">
      <Tooltip id="game-panel-tooltip" />

      <SequencerHeader></SequencerHeader>

      <div
        className="grow flex h-full"
        ref={panelRef}
        onDragOver={e => e.preventDefault()}
      >
        <div
          className="w-[25rem] flex-shrink-0 h-full bg-shade-700"
          ref={resizableRef}
        >
          <div className="flex h-10 items-center">
            <div
              className="bg-shade-300 px-5 text-3xl h-full flex items-center leading-0 cursor-pointer hover:bg-shade-200 transition-colors duration-20"
              onClick={addTrack}
              data-tooltip-id="game-panel-tooltip"
              data-tooltip-content={t("tracks.add_track")}
            >
              +
            </div>
          </div>

          <Reorder.Group
            axis="y"
            values={movableTracks}
            onReorder={changeOrder}
          >
            {movableTracks.map((track, index) => {
              return (
                <TrackHead
                  key={`${track.id}`}
                  onClick={editTrack}
                  track={track}
                />
              );
            })}
          </Reorder.Group>
        </div>
        <div
          className="w-[0.2rem] bg-shade-50 h-full cursor-ew-resize hide-ghost"
          onMouseDown={handleMouseDown}
        ></div>

        <TimeGrid tracks={movableTracks}></TimeGrid>
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
    </Panel>
  );
}

export default GamePanel;
