import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "../Panel";

import TextInput from "../form/inputs/TextInput";
import { debounce } from "lodash";

import {
  useMe,
  useIntrumentItems,
  usePlayerInstrument,
  useSelectInstrument,
} from "../../hooks/hooks";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { IInstrumentItem } from "../../../../common/types";
import { useLocalStorage } from "usehooks-ts";
interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export function SelectInstrumentModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  const me = useMe();
  const myInstrument = usePlayerInstrument(me ? me.id : null);
  const selectInstrument = useSelectInstrument();

  const instrumentItems = useIntrumentItems();

  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [showBookmarks, setShowBookmarks] = useState(true);

  const debouncedSearch = useRef(debounce(setSearch, 300)).current;

  const [bookmarkedInstruments, setBookmarkedInstruments] = useLocalStorage<{
    [key: string]: boolean;
  }>("bookmarkedInstruments", {});

  const handleSearchChange = useCallback(
    (e) => {
      const search = e.target.value;
      debouncedSearch(search);
      setInputValue(search);
    },
    [debouncedSearch]
  );

  const handleBookmarkClick = useCallback((instrumentItem: IInstrumentItem) => {
    if (bookmarkedInstruments[instrumentItem.identifier]) {
      delete bookmarkedInstruments[instrumentItem.identifier];
    } else {
      bookmarkedInstruments[instrumentItem.identifier] = true;
    }

    setBookmarkedInstruments(bookmarkedInstruments);
  }, []);

  const filteredInstrumentItems = useMemo(() => {
    let results: IInstrumentItem[] = instrumentItems;

    if (showBookmarks) {
      return results.filter((instrumentItem) => {
        return (
          bookmarkedInstruments[instrumentItem.identifier] &&
          instrumentItem.name.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (search) {
      results = results.filter((instrumentItem) => {
        return instrumentItem.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    return results;
  }, [search, showBookmarks, bookmarkedInstruments, instrumentItems]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 text-white"
        onClose={onClose ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl">
                <Panel style="primary" neon className="text-left " padding={10}>
                  <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
                    <div className="text-5xl font-black">
                      {t("select_instrument_modal.title")}
                    </div>
                  </Dialog.Title>

                  <div className="flex items-center gap-1 mb-2 text-xl uppercase">
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

                  <div className="overflow-y-scroll h-[40rem] bg-shade-700 rounded-2xl ">
                    {filteredInstrumentItems.map((instrument) => {
                      const isBookmarked =
                        bookmarkedInstruments[instrument.identifier];
                      const StarIcon = isBookmarked
                        ? AiFillStar
                        : AiOutlineStar;

                      return (
                        <div
                          key={instrument.identifier}
                          className={`cursor-pointer  ${
                            instrument.identifier ===
                            myInstrument?.getIdentifier()
                              ? "bg-primary-500 font-normal hover:bg-primary-400"
                              : "font-thin hover:bg-shade-300"
                          } border-b-[1px] border-shade-300 py-4 px-4 flex justify-between items-center`}
                          onClick={() => {
                            selectInstrument(instrument.identifier);
                            onClose?.();
                          }}
                        >
                          {instrument.name}

                          <StarIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmarkClick(instrument);
                            }}
                            className="h-8 w-8 text-yellow-500"
                          />
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SelectInstrumentModal;
