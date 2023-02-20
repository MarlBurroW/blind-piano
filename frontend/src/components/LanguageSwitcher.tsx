import { useTranslation } from "react-i18next";
import i18n from "../services/i18n";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();

  const languageOptions: Array<{
    value: string;
    label: string;
    flag: string;
  }> = [
    {
      value: "fr",
      label: t("languages.fr"),
      flag: "🇨🇵",
    },
    {
      value: "en",
      label: t("languages.en"),
      flag: "🇬🇧",
    },
  ];

  const selectedOption = languageOptions.find(
    (option) => option.value === i18n.language.split("-")[0]
  );

  return (
    <div className={className}>
      <Listbox
        value={selectedOption?.value}
        onChange={(lang) => {
          i18n.changeLanguage(lang);
        }}
      >
        <div className="relative">
          <Listbox.Button className=" relative rounded-md flex relative text-3xl">
            {selectedOption?.flag}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100 "
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-3 bg-base-300 dark:bg-base-800 rounded-md right-0 shadow-lg w-3xl">
              {languageOptions.map((language) => (
                <Listbox.Option
                  className="cursor-pointer px-4 py-2 dark:hover:bg-base-700 hover:bg-base-100 flex"
                  key={language.value}
                  value={language.value}
                >
                  <span className="mr-2">{language.flag} </span>{" "}
                  {t(`languages.${language.value}`)}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default LanguageSwitcher;
