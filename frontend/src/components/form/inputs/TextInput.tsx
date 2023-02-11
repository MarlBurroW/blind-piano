import React from "react";

interface Props {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
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
}: Props) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className={`${className} w-full bg-base-100 dark:ring-primary-500  dark:bg-base-700 mb-2 py-3 px-5 outline-none ring-primary-700 focus:outline-none focus:ring rounded-lg ${
        error ? "ring-red-400 outline-red-400" : ""
      }`}
    />
  );
};
export default TextInput;
