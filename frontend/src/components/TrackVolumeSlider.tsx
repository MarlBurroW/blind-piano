import { debounce, throttle } from "lodash";
import { useCallback, useMemo } from "react";

import { ITrack } from "../../../common/types";
import { useTrackMixerControl } from "../hooks/hooks";
import { RangeSlider } from "./form/inputs/RangeSlider";

interface Props {
  track: ITrack;
  color?: string;
}

export function TrackVolumeSlider({ track, color }: Props) {
  const { setVolume, volume } = useTrackMixerControl(track.id);

  const handleTrackVolumeChange = useCallback(
    (val: number) => {
      setVolume(val);
    },
    [setVolume]
  );

  const debouncedHandleTrackVolumeChange = useMemo(() => {
    return throttle(volume => {
      handleTrackVolumeChange(volume);
    }, 100);
  }, [handleTrackVolumeChange]);

  return (
    <RangeSlider
      value={volume ? volume : 0}
      color={color}
      onChange={val => {
        debouncedHandleTrackVolumeChange(val);
      }}
      min={0}
      max={1}
      formatValue={val => {
        return `${Math.round(val * 100)}%`;
      }}
    ></RangeSlider>
  );
}

export default TrackVolumeSlider;
