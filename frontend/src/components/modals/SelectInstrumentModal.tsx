import { Dialog, Transition } from "@headlessui/react";
import { debounce } from "lodash";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Virtuoso } from "react-virtuoso";
import { useLocalStorage } from "usehooks-ts";

import { instrumentCategories } from "../../../../common/instrument-categories";
import { IInstrumentCategory, IPatch } from "../../../../common/types";
import { useIntrumentItems } from "../../hooks/hooks";
import { Icon } from "../Icon";
import { Panel } from "../Panel";
import TextInput from "../form/inputs/TextInput";
import { BaseModal } from "./BaseModal";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onSelected: (patch: IPatch) => void;
  defaultPatch: IPatch | null;
}

const DEFAULT_BOOKMARKS = {
  "WAFInstrument@_tone_0001_FluidR3_GM_sf2_file": true,
  "WAFInstrument@_tone_0020_GeneralUserGS_sf2_file": true,
  "WAFInstrument@_tone_0040_FluidR3_GM_sf2_file": true,
};

export function SelectInstrumentModal({
  isOpen,
  onClose,
  defaultPatch,
  onSelected,
}: Props) {
  const { t } = useTranslation();

  const patches = useIntrumentItems();

  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<IInstrumentCategory | null>(null);

  const selectCategory = useCallback(
    (category: IInstrumentCategory) => {
      if (
        selectedCategory &&
        selectedCategory.identifier === category.identifier
      ) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(category);
      }
    },
    [selectedCategory]
  );

  const [showBookmarks, setShowBookmarks] = useState(false);

  const debouncedSearch = useRef(debounce(setSearch, 300)).current;

  const [bookmarkedPatches, setbookmarkedPatches] = useLocalStorage<{
    [key: string]: boolean;
  }>("bookmarkedPatches", DEFAULT_BOOKMARKS);

  const handleSearchChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const search = e.currentTarget.value;
      debouncedSearch(search);
      setInputValue(search);
    },
    [debouncedSearch]
  );

  const handleBookmarkClick = useCallback((patch: IPatch) => {
    if (bookmarkedPatches[patch.identifier]) {
      delete bookmarkedPatches[patch.identifier];
    } else {
      bookmarkedPatches[patch.identifier] = true;
    }

    setbookmarkedPatches(bookmarkedPatches);
  }, []);

  const filteredPatches = useMemo(() => {
    let results = Array.from(patches.values());

    if (showBookmarks) {
      results = results.filter(patch => {
        return (
          bookmarkedPatches[patch.identifier] &&
          patch.name.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (search) {
      results = results.filter(patch => {
        return patch.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (selectedCategory) {
      results = results.filter(patch => {
        return patch.category.identifier === selectedCategory.identifier;
      });
    }

    return results;
  }, [search, showBookmarks, bookmarkedPatches, patches, selectedCategory]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={45}>
      <Panel style="primary" neon className="text-left " padding={10}>
        <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
          <div className="text-5xl font-black">
            {t("select_instrument_modal.title")}
          </div>
        </Dialog.Title>

        <div className="flex items-center gap-1 mb-5 text-xl uppercase">
          <div
            onClick={() => setShowBookmarks(false)}
            className={`cursor-pointer rounded-l-3xl py-5 px-2 w-full text-center leading-none transition-all ${
              !showBookmarks ? "bg-primary-500" : "bg-shade-300 "
            }`}
          >
            {t("select_instrument_modal.all_instruments")}
          </div>
          <div
            onClick={() => setShowBookmarks(true)}
            className={`cursor-pointer rounded-r-3xl py-5 px-2 w-full text-center transition-all leading-none ${
              showBookmarks ? "bg-primary-500" : "bg-shade-300 "
            }`}
          >
            <span className="leading-none">
              {t("select_instrument_modal.bookmarks")}
            </span>
          </div>
        </div>

        <TextInput
          value={inputValue}
          className="mb-5"
          placeholder={t("select_instrument_modal.search_instrument")}
          onChange={handleSearchChange}
        ></TextInput>

        <div className="flex flex-wrap w-full gap-2 py-3 cursor-pointer">
          {Object.keys(instrumentCategories).map((key: string) => {
            return (
              <div
                onClick={() => selectCategory(instrumentCategories[key])}
                key={instrumentCategories[key].identifier}
                className={`${
                  instrumentCategories[key].identifier ===
                  selectedCategory?.identifier
                    ? "bg-primary-500"
                    : "bg-shade-300"
                } p-4 rounded-full transition-all`}
              >
                <Icon
                  className="fill-white h-12 w-12"
                  name={instrumentCategories[key].icon}
                ></Icon>
              </div>
            );
          })}
        </div>

        <div className="overflow-y-scroll h-[40rem] bg-shade-700 rounded-2xl ">
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={filteredPatches.length}
            itemContent={(index: number) => {
              const patch = filteredPatches[index];

              const isBookmarked = bookmarkedPatches[patch.identifier];
              const StarIcon = isBookmarked ? AiFillStar : AiOutlineStar;

              return (
                <div
                  key={index}
                  className={`cursor-pointer  ${
                    patch.identifier === defaultPatch?.identifier
                      ? "bg-primary-500 font-normal hover:bg-primary-400"
                      : "font-thin hover:bg-shade-300"
                  } border-b-[1px] border-shade-300 py-4 px-4 flex justify-between items-center`}
                  onClick={() => {
                    onSelected(patch);
                    onClose?.();
                  }}
                >
                  <div className="flex items-center">
                    <Icon
                      className="fill-white h-8 w-8 mr-5"
                      name={patch.category.icon}
                    />
                    {patch.name}
                  </div>

                  <StarIcon
                    onClick={e => {
                      e.stopPropagation();
                      handleBookmarkClick(patch);
                    }}
                    className="h-8 w-8 text-yellow-500"
                  />
                </div>
              );
            }}
          />
        </div>
      </Panel>
    </BaseModal>
  );
}

export default SelectInstrumentModal;
