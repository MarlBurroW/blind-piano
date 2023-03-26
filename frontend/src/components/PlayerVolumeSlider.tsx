import Player from "../../../backend/schemas/Player";
import { RangeSlider } from "./form/inputs/RangeSlider";
import { useContext, useCallback, useMemo } from "react";
import { AudioContext } from "./context/AudioContext";
import _ from "lodash";
interface Props {
  player: Player;
}

export function PlayerVolumeSlider({ player }: Props) {
  const { playersVolumes, setPlayerVolume } = useContext(AudioContext);

  const handlePlayerVolumeChange = useCallback(
    (playerId: string, val: number) => {
      setPlayerVolume(playerId, val);
    },
    [setPlayerVolume]
  );

  const debouncedHandlePlayerVolumeChange = useMemo(() => {
    return _.debounce((playerId, volume) => {
      handlePlayerVolumeChange(playerId, volume);
    }, 100);
  }, [handlePlayerVolumeChange]);

  return (
    <RangeSlider
      value={playersVolumes[player.id]}
      color={player.color}
      onChange={(val) => {
        debouncedHandlePlayerVolumeChange(player.id, val);
      }}
      min={0}
      max={1}
      formatValue={(val) => {
        return `${Math.round(val * 100)}%`;
      }}
    ></RangeSlider>
  );
}

export default PlayerVolumeSlider;
