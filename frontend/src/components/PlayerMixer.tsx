import Player from "../../../backend/schemas/Player";

import { Avatar } from "./Avatar";

import _ from "lodash";
import chroma from "chroma-js";
import { PlayerVolumeSlider } from "./PlayerVolumeSlider";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { usePlayerPatch, usePlayerMixerControl } from "../hooks/hooks";
import { Icon } from "./Icon";

interface Props {
  player: Player;
}

export function PlayerMixer({ player }: Props) {
  const { t } = useTranslation();

  const playerPatch = usePlayerPatch(player.id);

  const { volume } = usePlayerMixerControl(player.id);

  return (
    <div
      key={player.id}
      className=" px-8 py-8 rounded-3xl mb-5 border-l-8"
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
            style={{ borderColor: player.color }}
            className="mr-4 border-2 rounded-full"
          ></Avatar>
        </div>
        <div className="text-xl grow">
          {player.nickname} ({Math.round(volume * 100)}%)
        </div>

        <div className="flex items-center text-xl">
          {playerPatch && (
            <>
              <Icon
                name={playerPatch.category.icon}
                className="h-10 w-10 mr-4 fill-white"
              ></Icon>
              {playerPatch.name}
            </>
          )}
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
