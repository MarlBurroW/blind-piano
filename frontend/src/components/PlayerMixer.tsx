import Player from "../../../backend/schemas/Player";
import { useContext, useCallback, useMemo } from "react";
import { AudioContext } from "./context/AudioContext";
import { Avatar } from "./Avatar";
import { RangeSlider } from "./form/inputs/RangeSlider";
import _ from "lodash";
import chroma from "chroma-js";
import { PlayerVolumeSlider } from "./PlayerVolumeSlider";

import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface Props {
  player: Player;
}

export function PlayerMixer({ player }: Props) {
  const { playersVolumes, setPlayerVolume, playersInstruments } =
    useContext(AudioContext);

  const { t } = useTranslation();

  const playerInstrument = useMemo(() => {
    return playersInstruments[player.id];
  }, [playersInstruments[player.id], player]);

  return (
    <div
      key={player.id}
      className=" px-8 py-8 rounded-lg mb-5 border-2"
      style={{
        borderColor: player.color,
        backgroundColor: chroma(player.color).alpha(0.2).css(),
      }}
    >
      <div className="flex py-4 items-center">
        <div className="whitespace-nowrap text-lg">
          <Avatar
            background={true}
            circle
            size={60}
            seed={player.avatarSeed}
            className="mr-4"
          ></Avatar>
        </div>
        <div className="text-xl grow">
          {player.nickname} ({Math.round(playersVolumes[player.id] * 100)}%)
        </div>

        <div className="flex items-center text-xl">
          <MusicalNoteIcon className="h-6 w-6 mr-2" />
          {playerInstrument.getName()}
        </div>
      </div>
      <div className="w-full flex items-center">
        <SpeakerXMarkIcon className="h-8 w-8 mr-4" />
        <PlayerVolumeSlider player={player} />
        <SpeakerWaveIcon className="h-8 w-8 ml-4" />
      </div>
    </div>
  );
}

export default PlayerMixer;
