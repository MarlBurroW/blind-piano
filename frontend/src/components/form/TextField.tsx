import { ErrorMessage, useField, Field } from "formik";
import TextInput from "./inputs/TextInput";

interface Props {
  name: string;
  label?: string;
  className?: string;
  [x: string]: any;
}

export const TextField = (props: Props) => {
  const [field] = useField(props);

  return (
    <div className="mb-2">
      <TextInput
        className={props.className}
        type="text"
        {...field}
        {...props}
      />
      <ErrorMessage
        name={props.name}
        render={(msg) => (
          <span className="text-red-400 rounded-md tracking-widest text-xs">
            {msg}
          </span>
        )}
      />
    </div>
  );
};
export default TextField;
