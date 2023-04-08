import { useField } from "formik";

import { FieldBase } from "../FieldBase";
import { PatchInput } from "../inputs/PatchInput";

interface Props {
  name: string;
  label?: string;

  [x: string]: any;
}

export const PatchField = (props: Props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <FieldBase label={props.label} error={meta.error}>
      <PatchInput value={field.value} onChange={helpers.setValue} />
    </FieldBase>
  );
};
export default PatchField;
