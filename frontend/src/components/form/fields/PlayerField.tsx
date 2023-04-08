import { useField } from "formik";

import { FieldBase } from "../FieldBase";
import { PlayerInput } from "../inputs/PlayerInput";

interface Props {
  name: string;
  label?: string;

  [x: string]: any;
}

export const PlayerField = (props: Props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <FieldBase label={props.label} error={meta.error}>
      <PlayerInput value={field.value} onChange={helpers.setValue} />
    </FieldBase>
  );
};
export default PlayerField;
