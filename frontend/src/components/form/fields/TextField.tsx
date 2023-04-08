import { useField } from "formik";

import { FieldBase } from "../FieldBase";
import TextInput from "../inputs/TextInput";

interface Props {
  name: string;
  label?: string;
  [x: string]: any;
}

export const TextField = (props: Props) => {
  const [field, meta] = useField(props);

  return (
    <FieldBase label={props.label} error={meta.error}>
      <TextInput {...field} {...props} error={!!meta.error} />
    </FieldBase>
  );
};
export default TextField;
