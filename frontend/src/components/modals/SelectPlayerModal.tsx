import { Dialog } from "@headlessui/react";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IPlayer } from "../../../../common/types";
import { usePlayers } from "../../hooks/hooks";
import { Avatar } from "../Avatar";
import { Panel } from "../Panel";
import { BaseModal } from "./BaseModal";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onSelected: (player: IPlayer) => void;
  defaultPlayer: IPlayer | null;
}

export function SelectPlayerModal({
  isOpen,
  onClose,
  defaultPlayer,
  onSelected,
}: Props) {
  const { t } = useTranslation();

  const player = usePlayers();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={45}>
      <Panel style="primary" neon className="text-left " padding={10}>
        <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
          <div className="text-5xl font-black">
            {t("select_player_modal.title")}
          </div>
        </Dialog.Title>

        <div className="overflow-hidden bg-shade-700 rounded-2xl ">
          {player.map(player => {
            return (
              <div
                onClick={() => {
                  onClose?.();
                  onSelected?.(player);
                }}
                style={{
                  borderColor: player.color,
                }}
                className={`flex ${
                  defaultPlayer?.id == player.id
                    ? "bg-primary-500 hover:bg-primary-400"
                    : ""
                } items-center font-thin text-xl px-5 py-5 border-l-8 cursor-pointer transition-all `}
              >
                <Avatar
                  background={true}
                  circle
                  size={30}
                  seed={player.avatarSeed}
                  className="mr-4"
                ></Avatar>
                <p>{player.nickname}</p>
              </div>
            );
          })}
        </div>
      </Panel>
    </BaseModal>
  );
}
