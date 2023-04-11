import { useField } from "formik";

import { FieldBase } from "../form/FieldBase";
import TextInput from "./inputs/TextInput";

interface Props {
  name: string;
  label?: string;
  className?: string;
  errorClassName?: string;
  labelClassName?: string;

  [x: string]: any;
}

export const TextField = (props: Props) => {
  const [field, meta] = useField(props);

  return (
    <FieldBase
      errorClassName={props.errorClassName}
      labelClassName={props.labelClassName}
      label={props.label}
      error={meta.error}
    >
      <TextInput
        className={props.className}
        type="text"
        {...field}
        {...props}
      />
    </FieldBase>
  );
};
export default TextField;
