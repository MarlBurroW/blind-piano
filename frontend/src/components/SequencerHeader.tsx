import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Input } from "webmidi";

import { TimeSignature } from "../../../common/types";
import { useGameActions } from "../hooks/hooks";
import { MasterVolumeSlider } from "./MasterVolumeSlider";
import { SequencerContext } from "./context/SequencerContext";
import { DropdownSelectInput } from "./form/inputs/DropdownSelectInput";

export function SequencerHeader() {
  const { timeSignature } = useContext(SequencerContext);

  const { setTimeSignature } = useGameActions();

  const { t } = useTranslation();

  const signatureOptions = [
    { value: "3/4", label: "3/4", payload: null },
    { value: "4/4", label: "4/4", payload: null },
    { value: "5/4", label: "5/4", payload: null },
    { value: "6/8", label: "6/8", payload: null },
    { value: "7/8", label: "7/8", payload: null },
    { value: "12/8", label: "12/8", payload: null },
  ];

  const onTimeSignatureChange = useCallback(
    (value: string, payload: null) => {
      setTimeSignature(value as TimeSignature);
    },
    [setTimeSignature]
  );

  return (
    <div className="flex justify-center py-5 px-5 gap-5 items-center">
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

      <DropdownSelectInput<string, null>
        value={timeSignature}
        options={signatureOptions}
        onChange={onTimeSignatureChange}
      ></DropdownSelectInput>
    </div>
  );
}

export default SequencerHeader;
