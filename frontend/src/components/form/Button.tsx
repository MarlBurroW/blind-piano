interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  children,
  disabled,
  type,
  onClick,
  style = "primary",
  size = "md",
  fullWidth = false,
  className,
}: Props) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-10 py-4 text-base",
    lg: "px-14 py-5 text-lg",
  };

  const styles = {
    primary: {
      base: `font-semibold text-white uppercase transition-all rounded-md  hover:tracking-widest active:bg-gradient-to-b  border-b-4  duration-150`,
      active: `bg-gradient-to-t from-primary-500 to-primary-600 border-primary-900`,
      disabled: `dark:bg-base-700 dark:border-base-900 bg-base-400 border-base-500 opacity-50 pointer-events-none`,
    },
    secondary: {
      base: `font-semibold  uppercase transition-all rounded-md  hover:tracking-widest active:bg-gradient-to-b duration-150`,
      active: `border-primary-700 border-2 text-primary-700 bg-primary-200 dark:bg-base-800 dark:border-primary-500 dark:text-primary-500 `,
      disabled: `dark:bg-base-700 dark:border-base-900 bg-base-400 border-base-500 opacity-50 pointer-events-none`,
    },
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${className} ${fullWidth ? "w-full" : ""} ${sizes[size]}  ${
        disabled ? styles[style].disabled : styles[style].active
      } ${styles[style].base}`}
    >
      {children}
    </button>
  );
}
export default Button;
