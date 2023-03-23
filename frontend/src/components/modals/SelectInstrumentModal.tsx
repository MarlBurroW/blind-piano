import { Dialog, Transition } from "@headlessui/react";
import {
  Fragment,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";

import { GameContext } from "../context/GameContext";
import { AudioContext } from "../context/AudioContext";
import { getInstrumentItemFromIdentifier } from "../context/AudioContext";

import { Button } from "../form/Button";
import { Panel } from "../Panel";
import { IInstrumentItem } from "../../types";

import TextInput from "../form/inputs/TextInput";
import { debounce } from "lodash";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export function SelectInstrumentModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  const { gameRoom, me } = useContext(GameContext);
  const { playersInstruments, instrumentItems } = useContext(AudioContext);

  const currentInstrumentItem: IInstrumentItem | null = useMemo(() => {
    return me ? getInstrumentItemFromIdentifier(me.instrument) : null;
  }, [me?.instrument]);

  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const debouncedSearch = useRef(debounce(setSearch, 300)).current;

  const handleSearchChange = useCallback(
    (e) => {
      const search = e.target.value;
      debouncedSearch(search);
      setInputValue(search);
    },
    [debouncedSearch]
  );

  const filteredInstrumentItems = useMemo(() => {
    if (search === "") {
      return instrumentItems;
    }

    return instrumentItems.filter((instrumentItem) => {
      return instrumentItem.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

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

                  <TextInput
                    value={inputValue}
                    className="mb-5"
                    placeholder={t("select_instrument_modal.search_instrument")}
                    onChange={handleSearchChange}
                  ></TextInput>

                  <div className="overflow-y-scroll h-[40rem] bg-shade-700 rounded-2xl">
                    {filteredInstrumentItems.map((instrument) => (
                      <div
                        key={instrument.identifier}
                        className={`cursor-pointer  ${
                          instrument.identifier ===
                          currentInstrumentItem?.identifier
                            ? "bg-secondary-500 font-normal hover:bg-secondary-400"
                            : "font-thin hover:bg-shade-300"
                        } border-b-[1px] border-shade-300 py-4 px-4`}
                        onClick={() => {
                          gameRoom?.send(
                            "setInstrument",
                            instrument.identifier
                          );
                          onClose?.();
                        }}
                      >
                        {instrument.name}
                      </div>
                    ))}
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
