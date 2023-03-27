export const FieldLabel = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return <label className={`${className} font-bold mb-2 block`}>{label}</label>;
};
