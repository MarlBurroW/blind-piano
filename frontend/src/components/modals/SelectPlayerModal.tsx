import { Dialog } from "@headlessui/react";
import { Fragment, useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "../Panel";
import { Player } from "../../../../backend/schemas/Player";

import { BaseModal } from "./BaseModal";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onSelected: (player: Player) => void;
  defaultPlayer: Player | null;
}

export function SelectPlayerModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={45}>
      <Panel style="primary" neon className="text-left " padding={10}>
        <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
          <div className="text-5xl font-black">
            {t("select_player_modal.title")}
          </div>
        </Dialog.Title>
      </Panel>
    </BaseModal>
  );
}
