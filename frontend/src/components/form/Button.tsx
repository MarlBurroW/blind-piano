interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: "primary" | "secondary" | "danger";
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
      base: `font-semibold text-white uppercase transition-all  bg-gradient-to-b from-primary-400 via-primary-500 to-primary-600 rounded-3xl duration-300  bg-size-200 bg-pos-0 hover:bg-pos-100`,
      active: `bg-primary border-primary-500`,
      disabled: `dark:bg-primary-700 dark:border-primary-900 bg-primary-400 border-primary-500 opacity-50 pointer-events-none`,
    },
    secondary: {
      base: `font-semibold text-white uppercase transition-all  bg-gradient-to-b from-secondary-400 via-secondary-500 to-secondary-600 rounded-3xl duration-300  bg-size-200 bg-pos-0 hover:bg-pos-100`,
      active: `bg-secondary border-secondary-500`,
      disabled: `dark:bg-secondary-700 dark:border-secondary-900 bg-secondary-400 border-secondary-500 opacity-50 pointer-events-none`,
    },
    danger: {
      base: `font-semibold text-white uppercase transition-all rounded-md  hover:tracking-widest active:bg-gradient-to-b  border-b-4  duration-150`,
      active: `bg-gradient-to-t from-red-500 to-red-600 border-red-900`,
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
