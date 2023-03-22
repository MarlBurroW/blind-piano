import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { GameContext } from "../context/GameContext";
import { getInstrumentItemFromIdentifier } from "../context/AudioContext";

import { Button } from "../form/Button";
import { Panel } from "../Panel";
import { IInstrumentItem } from "../../types";
import {
  SFPInstrument,
  instrumentsItems as SFPInstrumentsItems,
} from "../../classes/SFPInstrument";
import {
  WAFInstrument,
  instrumentsItems as WAFInstrumentItems,
} from "../../classes/WAFInstrument";

const instrumentItems = [...SFPInstrumentsItems, ...WAFInstrumentItems];

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export function SelectInstrumentModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  const { gameRoom, me } = useContext(GameContext);

  const currentInstrumentItem: IInstrumentItem | null = useMemo(() => {
    return me ? getInstrumentItemFromIdentifier(me.instrument) : null;
  }, [me?.instrument]);

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

                  <div className="overflow-y-scroll h-80 bg-shade-700 px-4 py-4 rounded-2xl">
                    {instrumentItems.map((instrument) => (
                      <div
                        key={instrument.identifier}
                        className={`${
                          currentInstrumentItem?.identifier ===
                          instrument.identifier
                            ? "bg-secondary-500"
                            : "bg-shade-300"
                        } px-2 py-2 mb-4 rounded-md ${
                          currentInstrumentItem?.identifier ===
                          instrument.identifier
                            ? "hover:bg-secondary-400"
                            : "hover:bg-shade-200"
                        } cursor-pointer`}
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
