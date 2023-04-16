import { Dialog } from "@headlessui/react";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { MasterMixer } from "../MasterMixer";
import { Panel } from "../Panel";
import { BaseModal } from "./BaseModal";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export function MixerModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <BaseModal isOpen={isOpen} size={60} onClose={onClose}>
      <Panel style="primary" neon className="text-left" padding={10}>
        <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
          <div className="text-5xl font-black">{t("mixer_modal.title")}</div>
        </Dialog.Title>

        <MasterMixer />
      </Panel>
    </BaseModal>
  );
}

export default MixerModal;
