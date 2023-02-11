import { useField } from "formik";
import TextInput from "../inputs/TextInput";
import { FieldBase } from "../FieldBase";

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
