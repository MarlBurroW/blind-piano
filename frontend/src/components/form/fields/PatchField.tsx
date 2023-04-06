import { useField } from "formik";

import { FieldBase } from "../FieldBase";
import { useEffect, useState, useCallback } from "react";
import { SelectInstrumentModal } from "../../modals/SelectInstrumentModal";
import { IPatch } from "../../../../../common/types";
import { usePatch } from "../../../hooks/hooks";
import { Icon } from "../../Icon";

interface Props<ValueType> {
  name: string;
  label?: string;

  [x: string]: any;
}

export const PatchField = (props: Props<any>) => {
  const [field, meta, helpers] = useField(props);

  const patch = usePatch(field.value);

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
      helpers.setValue(patch.identifier);
    }
  }, [patch]);

  return (
    <FieldBase label={props.label} error={meta.error}>
      <SelectInstrumentModal
        onSelected={(patch) => helpers.setValue(patch.identifier)}
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
    </FieldBase>
  );
};
export default PatchField;
