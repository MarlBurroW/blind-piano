import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "../Panel";

import { PlayerMixer } from "../PlayerMixer";
import { MasterMixer } from "../MasterMixer";
import { usePlayers } from "../../hooks/hooks";
import { BaseModal } from "./BaseModal";
interface Props {
  isOpen: boolean;
  onClose?: () => void;
}
import _ from "lodash";

export function MixerModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  const players = usePlayers();

  return (
    <BaseModal isOpen={isOpen} size={60} onClose={onClose}>
      <Panel style="primary" neon className="text-left" padding={10}>
        <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
          <div className="text-5xl font-black">{t("mixer_modal.title")}</div>
        </Dialog.Title>

        <MasterMixer />

        {players.map((player) => {
          return <PlayerMixer player={player} key={player.id}></PlayerMixer>;
        })}
      </Panel>
    </BaseModal>
  );
}

export default MixerModal;
