export const FieldError = ({
  error,
  className,
}: {
  error: string;
  className?: string;
}) => {
  return (
    <div
      className={`${className} text-red-400 rounded-md tracking-widest text-xs`}
    >
      {error}
    </div>
  );
};
