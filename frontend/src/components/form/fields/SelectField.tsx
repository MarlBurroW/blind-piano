import { useField } from "formik";

import { FieldBase } from "../FieldBase";
import SelectInput from "../inputs/SelectInput";
import { Option } from "../inputs/SelectInput";

interface Props<ValueType> {
  name: string;
  label?: string;
  options: Array<Option<ValueType>>;
  [x: string]: any;
}

export const SelectField = (props: Props<any>) => {
  const [field, meta, helpers] = useField(props);

  return (
    <FieldBase label={props.label} error={meta.error}>
      <SelectInput
        {...field}
        {...props}
        onChange={helpers.setValue}
        error={!!meta.error}
      />
    </FieldBase>
  );
};
export default SelectField;
