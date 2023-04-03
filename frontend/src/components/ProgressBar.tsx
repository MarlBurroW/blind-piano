import { useMemo } from "react";

interface Props {
  min: number;
  max: number;
  value: number;
  className?: string;
}

export function ProgressBar({ min, max, value, className }: Props) {
  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max, value]);

  return (
    <div className={`${className} w-full bg-shade-700 h-4 rounded-3xl`}>
      <div
        style={{ width: `${percentage}%` }}
        className="bg-primary-500 h-4 rounded-3xl transition-all"
      ></div>
    </div>
  );
}

export default ProgressBar;
