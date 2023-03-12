interface Props {
  children?: React.ReactNode;
  style?: "primary" | "secondary";
  neon?: boolean;
  className?: string;
  padding?: number;
}

export function Panel({
  children,
  className,
  style = "primary",
  neon = false,
  padding = 5,
}: Props) {
  const styles = {
    primary: {
      neon: "border-4 shadow-2xl border-primary-400 shadow-primary-500/100",
    },
    secondary: {
      neon: "border-4 shadow-2xl border-secondary-400 shadow-secondary-500/100",
    },
  };

  return (
    <div
      className={`${className} ${
        neon ? styles[style].neon : ""
      } transition-all  p-${padding} rounded-3xl bg-gradient-to-b w-full from-shade-400 to-shade-600`}
    >
      {children}
    </div>
  );
}

export default Panel;
