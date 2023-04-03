import React, { ChangeEvent } from "react";
import { BsCheckLg } from "react-icons/bs";

interface CheckBoxInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export const CheckBoxInput: React.FC<CheckBoxInputProps> = ({
  value,
  onChange,
  label,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={handleChange}
        className="w-0 h-0 opacity-0 absolute"
      />
      <span className="relative">
        <span
          className={`${
            value
              ? "bg-primary-500 border-2 border-primary-500"
              : " border-primary-500 border-2"
          } w-7 h-7 inline-block rounded-md transition-all`}
        ></span>
        <span
          className={`${
            value ? "block" : "hidden"
          } absolute inset-0 h-7 w-7 flex items-center justify-center text-white`}
        >
          <BsCheckLg></BsCheckLg>
        </span>
      </span>
      <span className="ml-2">{label}</span>
    </label>
  );
};

export default CheckBoxInput;
