import { useContext, useCallback, useMemo } from "react";
import { AudioContext } from "./context/AudioContext";
import { RangeSlider } from "./form/inputs/RangeSlider";
import _ from "lodash";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

interface Props {}

export function MasterMixer({}: Props) {
  const { setMasterVolume, masterVolume } = useContext(AudioContext);

  const handleVolumeChange = useCallback((val: number) => {
    console.log(val);
    setMasterVolume(val);
  }, []);

  const debouncedHandleVolumeChange = useMemo(() => {
    return _.debounce(handleVolumeChange, 100);
  }, [handleVolumeChange]);

  return (
    <div className="bg-shade-300 px-10 py-5 rounded-lg mb-5">
      <div className="flex py-4">
        <div className="whitespace-nowrap  text-2xl min-w-[20rem] text-center w-full">
          Master volume ({Math.round(masterVolume * 100)}%)
        </div>
      </div>
      <div className="w-full flex items-center">
        <SpeakerXMarkIcon className="h-8 w-8 mr-4" />

        <RangeSlider
          value={masterVolume}
          onChange={debouncedHandleVolumeChange}
          min={0}
          max={1}
          formatValue={(val) => {
            return `${Math.round(val * 100)}%`;
          }}
        ></RangeSlider>
        <SpeakerWaveIcon className="h-8 w-8 ml-4" />
      </div>
    </div>
  );
}

export default MasterMixer;
