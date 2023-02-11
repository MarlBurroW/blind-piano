import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

export const FieldBase = ({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label?: string;
}) => {
  return (
    <div className="mb-4">
      {label ? <FieldLabel label={label} /> : null}
      {children}
      {error ? <FieldError error={error} /> : null}
    </div>
  );
};
