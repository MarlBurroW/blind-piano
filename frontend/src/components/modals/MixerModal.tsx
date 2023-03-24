import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar } from "../Avatar";

import { GameContext } from "../context/GameContext";
import { AudioContext } from "../context/AudioContext";

import { Panel } from "../Panel";
import { RangeSlider } from "../form/inputs/RangeSlider";
interface Props {
  isOpen: boolean;
  onClose?: () => void;
}
import _ from "lodash";

export function MixerModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  const { gameRoom, me, players } = useContext(GameContext);
  const {
    playersInstruments,
    instrumentItems,
    playersVolumes,
    setPlayerVolume,
    setMasterVolume,
    masterVolume,
  } = useContext(AudioContext);

  const handleVolumeChange = useCallback((val: number) => {
    console.log(val);
    setMasterVolume(val);
  }, []);

  const debouncedHandleVolumeChange = useMemo(() => {
    return _.debounce(handleVolumeChange, 100);
  }, [handleVolumeChange]);

  const handlePlayerVolumeChange = useCallback(
    (playerId: string, val: number) => {
      setPlayerVolume(playerId, val);
    },
    [setPlayerVolume]
  );

  const debouncedHandlePlayerVolumeChange = useMemo(() => {
    return _.debounce((playerId, volume) => {
      handlePlayerVolumeChange(playerId, volume);
    }, 100);
  }, [handlePlayerVolumeChange]);

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

                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="whitespace-nowrap px-10 py-5 text-lg min-w-[20rem]">
                          Master volume ({Math.round(masterVolume * 100)}%)
                        </td>
                        <td className="w-full">
                          <RangeSlider
                            value={masterVolume}
                            onChange={debouncedHandleVolumeChange}
                            min={0}
                            max={1}
                            formatValue={(val) => {
                              return `${Math.round(val * 100)}%`;
                            }}
                          ></RangeSlider>
                        </td>
                      </tr>

                      {players.map((player) => {
                        return (
                          <tr key={player.id}>
                            <td className="whitespace-nowrap px-10 py-5 text-lg min-w-[20rem]">
                              <div class="flex items-center">
                                <Avatar
                                  background={true}
                                  circle
                                  size={40}
                                  seed={player.avatarSeed}
                                  className="mr-4"
                                ></Avatar>
                                {player.nickname} (
                                {Math.round(playersVolumes[player.id] * 100)}%)
                              </div>
                            </td>
                            <td className="w-full">
                              <RangeSlider
                                value={playersVolumes[player.id]}
                                onChange={(val) => {
                                  debouncedHandlePlayerVolumeChange(
                                    player.id,
                                    val
                                  );
                                }}
                                min={0}
                                max={1}
                                formatValue={(val) => {
                                  return `${Math.round(val * 100)}%`;
                                }}
                              ></RangeSlider>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
