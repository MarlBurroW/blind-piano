import chroma from "chroma-js";
import { DragControls, Reorder, useDragControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { MdOutlineDragHandle } from "react-icons/md";

import { IPatch, ITrack } from "../../../common/types";
import {
  useGameActions,
  usePatch,
  usePlayer,
  useTrackAnalyser,
} from "../hooks/hooks";
import Avatar from "./Avatar";
import { Icon } from "./Icon";
import { Popover } from "./Popover";
import { TrackPopoverMenu } from "./TrackPopoverMenu";
import { TrackVolumeSlider } from "./TrackVolumeSlider";
import { VuMeter } from "./VuMeter";
import SelectInstrumentModal from "./modals/SelectInstrumentModal";

interface Props {
  track: ITrack;
  onClick?: (track: ITrack) => void;
}

type PopoverMethods = React.ElementRef<typeof Popover>;
const MAX_LEVEL = 90; // (255 * 0.33)
export function TrackHead({ track, onClick }: Props) {
  const patch = usePatch(track.patch);
  const player = usePlayer(track.playerId);
  const dragControls = useDragControls();
  const { selectTrackPatch } = useGameActions();
  const [isDragging, setIsDragging] = useState(false);
  const [isSelectInstrumentModalOpen, setIsSelectInstrumentModalOpen] =
    useState(false);
  const [levelIndicator, setLevelIndicator] = useState(0);

  const analyser = useTrackAnalyser(track.id);

  // CHATGPT ICI POUR LE VOLUME

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const popoverRef = useRef<PopoverMethods>(null);

  useEffect(() => {
    if (isDragging) {
      popoverRef.current?.setOpen(false);
    }
  }, [isDragging]);

  const handlePatchSelected = useCallback((patch: IPatch) => {
    selectTrackPatch(track.id, patch.identifier);
  }, []);

  return (
    <Reorder.Item
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      dragControls={dragControls}
      dragListener={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      exit={{ scale: 0 }}
      value={track}
      transition={{
        type: "tween",
        duration: 0.3,
        ease: "linear",
      }}
    >
      <SelectInstrumentModal
        defaultPatch={patch}
        onSelected={handlePatchSelected}
        onClose={() => {
          setIsSelectInstrumentModalOpen(false);
        }}
        isOpen={isSelectInstrumentModalOpen}
      ></SelectInstrumentModal>

      <Popover
        ref={popoverRef}
        popoverContent={
          <TrackPopoverMenu
            onChangePatchClicked={() => {
              popoverRef.current?.setOpen(false);
              setIsSelectInstrumentModalOpen(true);
            }}
            track={track}
          />
        }
      >
        {props => {
          const { setReference, getReferenceProps } = props;
          return (
            <div
              ref={setReference}
              className="h-[10rem] select-none  w-[20rem] flex flex-col"
            >
              <div
                style={{
                  backgroundColor: player?.color
                    ? chroma(player.color).luminance(0.2).css()
                    : undefined,
                }}
                className="text-md    p-1 px-3 bg-shade-500  justify-between flex items-center"
              >
                <div className="flex items-center w-full">
                  <MdOutlineDragHandle
                    onPointerDown={e => dragControls?.start(e)}
                    className="h-6 w-6 mr-2 cursor-grab"
                  ></MdOutlineDragHandle>{" "}
                  {track.name}
                  <div className="grow"></div>
                  <div>
                    <CiSettings
                      {...getReferenceProps()}
                      className="h-6 w-6 cursor-pointer"
                    ></CiSettings>
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: player?.color
                    ? chroma(player.color).luminance(0.1).css()
                    : undefined,
                }}
                className="flex flex-col  grow px-4  bg-shade-300 "
              >
                <div className="flex items-center py-2">
                  {patch && (
                    <div
                      style={{
                        backgroundColor: player
                          ? chroma(player.color).darken(0.4).css()
                          : undefined,
                      }}
                      className="relative transition-all bg-black bg-opacity-10  p-2 rounded-full mr-4"
                    >
                      <Icon
                        name={patch.category.icon}
                        className="h-8 w-8 block fill-white"
                      ></Icon>
                      {player && (
                        <Avatar
                          className="mr-2 absolute -top-2 -left-2"
                          seed={player.avatarSeed}
                          size={24}
                          background
                          circle
                        ></Avatar>
                      )}
                    </div>
                  )}

                  <div>
                    <div>{patch?.name}</div>
                  </div>
                </div>
                <div className="px-0">
                  {analyser && (
                    <VuMeter color={player?.color} analyser={analyser} />
                  )}
                  <TrackVolumeSlider
                    color={player?.color}
                    track={track}
                  ></TrackVolumeSlider>
                </div>
              </div>
            </div>
          );
        }}
      </Popover>
    </Reorder.Item>
  );
}

export default TrackHead;
