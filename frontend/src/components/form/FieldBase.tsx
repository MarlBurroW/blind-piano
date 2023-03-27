import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

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
      {children}
      {error ? <FieldError className={errorClassName} error={error} /> : null}
    </div>
  );
};
