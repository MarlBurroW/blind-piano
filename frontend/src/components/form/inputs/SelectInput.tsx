import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";

export interface Option<ValueType> {
  value: ValueType;
  label: string;
  disabled?: boolean;
  [x: string]: any;
}

interface Props<ValueType> {
  options: Array<Option<ValueType>>;
  value?: ValueType;
  onChange?: (value: any) => void;
  error?: boolean;
  disabled?: boolean;
  style?: "primary" | "secondary";
}

export const SelectInput = ({
  value,
  options,
  error,
  onChange,
  disabled,
  style = "primary",
}: Props<any>) => {
  const [selectedOption, setSelectedOption] = useState<Option<any>>(options[0]);

  useEffect(() => {
    const defaultOption = options.find(option => option.value === value);

    if (defaultOption) {
      setSelectedOption(defaultOption);
    }
  }, [value, options]);

  const styles = {
    primary: {
      button: "ring-primary-300",
      activeOption: "bg-primary-400",
    },
    secondary: {
      button: "ring-secondary-400",
      activeOption: "bg-secondary-400",
    },
  };

  return (
    <Listbox
      value={options.find(option => option.value === value)}
      disabled={disabled}
      onChange={option => {
        setSelectedOption(option);
        onChange && onChange(option.value);
      }}
    >
      {({ open }) => (
        <div className={`relative rounded-lg`}>
          <Listbox.Button
            className={`relative text-left ${
              styles[style].button
            } focus:ring w-full bg-shade-200  py-4 px-5 rounded-3xl ${
              open ? "drop-shadow-lg rounded-b-none" : ""
            }  ${error ? "input-error " : ""}`}
          >
            <span className="block truncate">{selectedOption.label}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronUpDownIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 w-full overflow-auto text-base border-none rounded-b-3xl drop-shadow-lg border-primary-700  max-h-60 bg-base-100 sm:text-sm">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-10 pr-4 bg-shade-200 ${
                      active ? `${styles[style].activeOption} text-white` : ""
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
export default SelectInput;
