import { useCallback, useEffect, useState } from "react";

import { IPatch } from "../../../../../common/types";
import { usePatch } from "../../../hooks/hooks";
import { Icon } from "../../Icon";
import { SelectInstrumentModal } from "../../modals/SelectInstrumentModal";

interface Props {
  value: string;
  onChange: (value: string) => void;
  [x: string]: any;
}

export const PatchInput = (props: Props) => {
  const patch: IPatch | null = usePatch(props.value ? props.value : "");

  const [selectInstrumentModalOpen, setSelectIntrumentModalOpen] =
    useState(false);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        // Effectuez l'action souhaitée, par exemple, ouvrir une modal
        setSelectIntrumentModalOpen(true);
      }
    },
    []
  );

  useEffect(() => {
    if (patch) {
      props.onChange(patch.identifier);
    }
  }, [patch]);

  return (
    <>
      <SelectInstrumentModal
        onSelected={patch => props.onChange(patch.identifier)}
        defaultPatch={patch}
        isOpen={selectInstrumentModalOpen}
        onClose={() => setSelectIntrumentModalOpen(false)}
      ></SelectInstrumentModal>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setSelectIntrumentModalOpen(true)}
        className={`w-full cursor-pointer flex items-center bg-shade-200 mb-2 py-4 px-5 outline-none ring-primary-300 focus:outline-none focus:ring rounded-3xl`}
      >
        {patch && (
          <Icon
            className="h-6 w-7 fill-white mr-4"
            name={patch?.category.icon}
          />
        )}

        {patch ? patch.name : "Select a patch"}
      </div>
    </>
  );
};
export default PatchInput;
