import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";

export const FieldBase = ({
  children,
  error,
  label,
  labelClassName,
  errorClassName,
}: {
  children: React.ReactNode;
  error?: string;
  label?: string;
  labelClassName?: string;
  errorClassName?: string;
}) => {
  return (
    <div className="mb-4">
      {label ? <FieldLabel className={labelClassName} label={label} /> : null}
      <div className="mb-2">{children}</div>
      {error ? <FieldError className={errorClassName} error={error} /> : null}
    </div>
  );
};
