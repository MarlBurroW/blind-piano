export const FieldError = ({ error }: { error: string }) => {
  return (
    <div className="text-red-400 rounded-md tracking-widest text-xs">
      {error}
    </div>
  );
};
