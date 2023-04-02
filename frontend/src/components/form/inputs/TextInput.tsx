import React from "react";

interface Props {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  style?: "primary" | "secondary";
}

export const TextInput = ({
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  disabled,
  error = false,
  className,
  style = "primary",
}: Props) => {
  const styles = {
    primary: "ring-primary-300",
    secondary: "ring-secondary-400",
  };

  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className={`${className} ${
        styles[style]
      } w-full bg-shade-200 mb-2 py-4 px-5 outline-none   focus:outline-none focus:ring rounded-3xl ${
        error ? "ring-red-400 outline-red-400" : ""
      }`}
    />
  );
};
export default TextInput;
