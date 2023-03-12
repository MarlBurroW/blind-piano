import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import TextField from "../components/form/fields/TextField";

import SelectField from "../components/form/fields/SelectField";

import client from "../services/colyseus";
import { Room, RoomAvailable } from "colyseus.js";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import serverErrorHandler from "../services/serverErrorHandler";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { Button } from "../components/form/Button";

import { RoomItem } from "../components/RoomItem";

import Logo from "../assets/midi-keyboard.png";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "../PageTransition";
import { useAppStore } from "../stores/app";
import { Panel } from "../components/Panel";

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

  const { storeGameRoom } = useAppStore((state) => state);

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
          setState((draft) => {
            draft.lobbyRoom = lobby;
          });
        })
        .catch((err) => {
          console.log("JOIN ERROR", err);
        });
    };
    init();

    return () => {
      state.lobbyRoom?.leave();
    };
  }, []);

  useEffect(() => {
    state.lobbyRoom?.onMessage("rooms", (rooms) => {
      console.log("ROOMS UPDATED", rooms);
      setState((draft) => {
        draft.rooms = rooms;
      });
    });

    state.lobbyRoom?.onMessage("+", ([roomId, room]) => {
      console.log("ROOM ADDED");
      setState((draft) => {
        // Create or update a room in draft.rooms array, with roomId as the key
        const index = draft.rooms.findIndex((r) => r.roomId === room.roomId);
        if (index === -1) {
          draft.rooms.push(room);
        } else {
          draft.rooms[index] = room;
        }
      });
    });

    state.lobbyRoom?.onMessage("-", (roomId) => {
      setState((draft) => {
        // Remove a room from draft.rooms array, with roomId as the key
        draft.rooms = draft.rooms.filter((r) => r.roomId !== roomId);
      });
    });
  }, [state.lobbyRoom]);

  return (
    <PageTransition>
      <div className="self-center pt-10 max-w-7xl mx-auto justify-center flex-col h-full  items-center  gap-x-7">
        <div className="flex flex-col items-center w-full">
          <img className="h-44 lg:h-48 2xl:h-64 mb-10" src={Logo}></img>

          <h1 className=" font-thin uppercase text-transparent text-7xl lg:text-8xl 2xl:text-9xl bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-400">
            Blind Piano
          </h1>
          <div className=" mb-10 text-2xl font-thin">
            {t("lobby_page.made_by")} <strong>MarlburroW</strong>
          </div>
        </div>

        <div className="flex gap-x-6">
          <Panel padding={10} style="secondary" neon>
            <div className="mb-10 text-white text-5xl  font-normal text-center ">
              {t("lobby_page.create_game")}
            </div>

            <FormikProvider value={createGameForm}>
              <form onSubmit={createGameForm.handleSubmit}>
                <TextField
                  style="secondary"
                  label={t("lobby_page.game_name")}
                  placeholder={t("lobby_page.game_name")}
                  name="gameName"
                ></TextField>
                <div className="mb-10">
                  <SelectField
                    style="secondary"
                    label={t("lobby_page.visibility")}
                    name="visibility"
                    options={visibilityOptions}
                  ></SelectField>
                </div>
                <Button
                  style="secondary"
                  fullWidth
                  disabled={!createGameForm.isValid}
                >
                  {t("lobby_page.create_game")}
                </Button>
              </form>
            </FormikProvider>
          </Panel>

          <Panel padding={10} style="primary" neon>
            <div className="mb-10   text-5xl font-normal text-center">
              {t("lobby_page.join_game")}
            </div>
            <div className="">
              <AnimatePresence>
                {state.rooms.map((room) => {
                  return (
                    <motion.div
                      key={room.roomId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <RoomItem room={room} className="mb-2"></RoomItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {state.rooms.length === 0 && (
                <div className="text-center text-opacity-50 text-base-content">
                  {t("lobby_page.no_games")}
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </PageTransition>
  );
}
