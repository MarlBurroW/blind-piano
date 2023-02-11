import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import TextField from "../components/form/fields/TextField";

import SelectField from "../components/form/fields/SelectField";

import client from "../services/colyseus";
import { Room, RoomAvailable } from "colyseus.js";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../stores/app";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import serverErrorHandler from "../services/serverErrorHandler";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { Button } from "../components/form/Button";

import { RoomItem } from "../components/RoomItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function LobbyPage() {
  interface LobbyPageState {
    lobbyRoom: Room | null;
    rooms: Array<RoomAvailable>;
  }

  const navigate = useNavigate();
  const [state, setState] = useImmer<LobbyPageState>({
    lobbyRoom: null,
    rooms: [],
  });

  const storeGameRoom = useAppStore((state) => state.storeRoom);
  const { t } = useTranslation();

  const visibilityOptions: Array<{ value: string; label: string }> = [
    { value: "public", label: t("visibilities.public") },
    { value: "private", label: t("visibilities.private") },
  ];

  const createGameForm = useFormik({
    initialValues: {
      gameName: uniqueNamesGenerator({
        separator: " ",
        style: "capital",
        dictionaries: [adjectives, colors, animals],
      }),
      visibility: "public",
    },
    onSubmit: (values) => {
      client
        .create("game", {
          name: values.gameName,
          visibility: values.visibility,
        })
        .then((room) => {
          toast.success(t("success_messages.game_created"));

          console.log("ROOM CREATED", room);

          state.lobbyRoom?.leave();

          storeGameRoom(room);

          navigate(`/games/${room.id}`);
        })
        .catch(serverErrorHandler);
    },
    validationSchema: Yup.object({
      gameName: Yup.string()
        .required(t("validation_rules.required"))
        .min(3, t("validation_rules.min_char", { min: 3 }))
        .max(32, t("validation_rules.max_char", { max: 32 }))
        .trim(),
      visibility: Yup.string()
        .required("Required")
        .matches(/^(public|private)$/, "Invalid visibility"),
    }),
  });

  useEffect(() => {
    const init = async () => {
      client
        .joinOrCreate("lobby")
        .then((lobby) => {
          lobby.onMessage("rooms", (rooms) => {
            console.log("ROOMS UPDATED");
            setState((draft) => {
              draft.rooms = rooms;
            });
          });

          lobby.onMessage("+", ([roomId, room]) => {
            console.log("ROOM ADDED");
            setState((draft) => {
              // Create or update a room in draft.rooms array, with roomId as the key
              const index = draft.rooms.findIndex(
                (r) => r.roomId === room.roomId
              );
              if (index === -1) {
                draft.rooms.push(room);
              } else {
                draft.rooms[index] = room;
              }
            });
          });

          lobby.onMessage("-", (roomId) => {
            setState((draft) => {
              // Remove a room from draft.rooms array, with roomId as the key
              draft.rooms = draft.rooms.filter((r) => r.roomId !== roomId);
            });
          });

          setState((draft) => {
            draft.lobbyRoom = lobby;
          });
        })
        .catch((err) => {
          console.log("JOIN ERROR", err);
        });
    };
    init();
  }, []);

  return (
    <div className="self-center max-w-7xl mx-auto grow flex gap-x-7">
      <div className="w-full  p-10 shadow-xl rounded-2xl  bg-base-200 dark:bg-base-800 ">
        <div className="mb-10 text-3xl font-black text-center ">
          {t("lobby_page.create_game")}
        </div>

        <FormikProvider value={createGameForm}>
          <form onSubmit={createGameForm.handleSubmit}>
            <TextField
              label={t("lobby_page.game_name")}
              placeholder={t("lobby_page.game_name")}
              name="gameName"
            ></TextField>
            <SelectField
              label={t("lobby_page.visibility")}
              name="visibility"
              options={visibilityOptions}
            ></SelectField>
            <Button fullWidth disabled={!createGameForm.isValid}>
              {t("lobby_page.create_game")}
            </Button>
          </form>
        </FormikProvider>
      </div>

      <div className="w-full p-10 shadow-xl rounded-2xl  bg-base-200 dark:bg-base-800 ">
        <div className="mb-10  text-3xl font-black text-center">
          {t("lobby_page.join_game")}
        </div>
        <div className="">
          <TransitionGroup component={null}>
            {state.rooms.map((room) => {
              return (
                <CSSTransition key={room.roomId} timeout={300} classNames="pop">
                  <RoomItem room={room} className="mb-2"></RoomItem>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
          {state.rooms.length === 0 && (
            <div className="text-center text-opacity-50 text-base-content">
              {t("lobby_page.no_games")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}