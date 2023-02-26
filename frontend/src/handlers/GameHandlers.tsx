import { Player } from "../../../backend/schemas/Player";
import toast from "react-hot-toast";
import sfx from "../services/sfx";
import { Avatar } from "../components/Avatar";
import i18n from "../services/i18n";
import { useEffect, useCallback, useContext } from "react";
import { Room } from "colyseus.js";
import { IMessage } from "../types";

export function onPlayerKicked(player: Player, gameRoom: Room) {
  sfx.playSound("player-kicked");

  toast.error(
    player.id === gameRoom?.sessionId
      ? i18n.t("notification_messages.you_were_kicked")
      : i18n.t("notification_messages.player_kicked", {
          nickname: player.nickname,
        }),
    {
      icon: (
        <Avatar background circle size={60} seed={player.avatarSeed}></Avatar>
      ),
    }
  );
}
export function onPlayerJoined(player: Player, gameRoom: Room) {
  console.log("PLAYER JOINED", player);
  sfx.playSound("player-joined");
  toast.custom(
    <div className="flex">
      {i18n.t("notification_messages.player_joined", {
        nickname: player.nickname,
      })}
    </div>
  );
}

export function onPlayerLeft(player: Player) {
  console.log("PLAYER LEFT", player);
  sfx.playSound("player-left");
  toast.success(
    i18n.t("notification_messages.player_left", {
      nickname: player.nickname,
    })
  );
}

export function onNewLeader(player: Player, me: Player | null) {
  console.log("NEW LEADER", player, me);
  if (player.id === me?.id) {
    toast.success(i18n.t("notification_messages.you_are_new_leader"));
    sfx.playSound("you-are-promoted");
  } else {
    toast.success(
      i18n.t("notification_messages.new_leader", {
        nickname: player.nickname,
      }),
      {
        icon: (
          <Avatar background circle size={60} seed={player.avatarSeed}></Avatar>
        ),
      }
    );
  }
}

export default {
  onPlayerKicked,
  onPlayerJoined,
  onPlayerLeft,
  onNewLeader,
};
