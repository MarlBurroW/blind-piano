import _ from "lodash";
import { useCallback, useMemo } from "react";

import { IPlayer } from "../../../common/types";
import { usePlayerMixerControl } from "../hooks/hooks";
import { RangeSlider } from "./form/inputs/RangeSlider";

interface Props {
  player: IPlayer;
}

export function PlayerVolumeSlider({ player }: Props) {
  const { setVolume, volume } = usePlayerMixerControl(player.id);

  const handlePlayerVolumeChange = useCallback(
    (playerId: string, val: number) => {
      setVolume(val);
    },
    [setVolume]
  );

  const debouncedHandlePlayerVolumeChange = useMemo(() => {
    return _.debounce((playerId, volume) => {
      handlePlayerVolumeChange(playerId, volume);
    }, 100);
  }, [handlePlayerVolumeChange]);

  return (
    <RangeSlider
      value={volume}
      color={player.color}
      onChange={val => {
        debouncedHandlePlayerVolumeChange(player.id, val);
      }}
      min={0}
      max={1}
      formatValue={val => {
        return `${Math.round(val * 100)}%`;
      }}
    ></RangeSlider>
  );
}

export default PlayerVolumeSlider;
