import { useTranslation } from "react-i18next";
import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useAppStore } from "../stores/app";
import { useLocalStorage } from "usehooks-ts";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { theme, storeTheme } = useAppStore((state) => state);

  const [storedTheme, setStoredTheme] = useLocalStorage<string>(
    "theme",
    "light"
  );

  const themeOptions: Array<{
    value: string;
    label: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      value: "dark",
      label: "themes.dark",
      icon: MoonIcon,
    },
    {
      value: "light",
      label: "themes.light",
      icon: SunIcon,
    },
  ];

  const selectedOption = themeOptions.find((option) => option.value === theme);

  return (
    <div className={className}>
      <Listbox
        value={selectedOption?.value}
        onChange={(theme) => {
          storeTheme(theme);
          setStoredTheme(theme);
        }}
      >
        <div className="relative ">
          <Listbox.Button className="relative flex text-3xl text-white rounded-md">
            {selectedOption?.icon ? (
              <selectedOption.icon className="w-8 h-8" />
            ) : null}{" "}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100 "
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute bg-base-300 dark:bg-base-800 right-0 z-10 mt-3 rounded-md shadow-lg bg-base-300 w-3xl">
              {themeOptions.map((option) => (
                <Listbox.Option
                  className="flex px-4 py-2 cursor-pointer dark:hover:bg-base-700 hover:bg-base-100"
                  key={option.value}
                  value={option.value}
                >
                  {option?.icon ? (
                    <span className="flex">
                      <option.icon className="w-8 h-8 mr-2" /> {t(option.label)}
                    </span>
                  ) : null}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default ThemeSwitcher;
