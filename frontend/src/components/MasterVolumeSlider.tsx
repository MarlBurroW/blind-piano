import { throttle } from "lodash";
import { useCallback, useMemo } from "react";

import { useMasterMixerControl } from "../hooks/hooks";
import { RangeSlider } from "./form/inputs/RangeSlider";

export function MasterVolumeSlider() {
  const { setVolume, volume } = useMasterMixerControl();

  const handleMasterVolumeChange = useCallback(
    (val: number) => {
      setVolume(val);
    },
    [setVolume]
  );

  const debouncedHandleMasterVolumeChange = useMemo(() => {
    return throttle((volume: number) => {
      handleMasterVolumeChange(volume);
    }, 100);
  }, [handleMasterVolumeChange]);

  return (
    <RangeSlider
      value={volume}
      onChange={val => {
        debouncedHandleMasterVolumeChange(val);
      }}
      min={0}
      max={1}
      formatValue={val => {
        return `${Math.round(val * 100)}%`;
      }}
    ></RangeSlider>
  );
}

export default MasterVolumeSlider;
