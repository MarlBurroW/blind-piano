import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "../Panel";

import { PlayerMixer } from "../PlayerMixer";
import { MasterMixer } from "../MasterMixer";
import { usePlayers } from "../../hooks/hooks";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}
import _ from "lodash";

export function MixerModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  const players = usePlayers();

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
              <Dialog.Panel className="w-full max-w-[75rem]">
                <Panel style="primary" neon className="text-left " padding={10}>
                  <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
                    <div className="text-5xl font-black">
                      {t("mixer_modal.title")}
                    </div>
                  </Dialog.Title>

                  <MasterMixer />

                  {players.map((player) => {
                    return (
                      <PlayerMixer
                        player={player}
                        key={player.id}
                      ></PlayerMixer>
                    );
                  })}
                </Panel>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default MixerModal;
