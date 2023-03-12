import React, { useEffect, useCallback, useMemo, useRef } from "react";

import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useImmer, DraftFunction } from "use-immer";
import { WebMidi } from "webmidi";
import type { Input } from "webmidi";
import _ from "lodash";
interface IMidiContext {
  devices: Array<Input>;
  selectedDevice: Input | null;
  selectDevice: (device: Input | null) => void;
}

const initialContextValues = {
  devices: [],
  selectedDevice: null,
  selectDevice: () => {},
};

type State = {
  devices: Array<Input>;
  selectedDevice: Input | null;
};

const initialState = {
  devices: [],
  selectedDevice: null,
};

export const MidiContext =
  React.createContext<IMidiContext>(initialContextValues);

export function MidiProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  const [state, setState] = useImmer<State>(initialState);

  const { devices, selectedDevice } = state;

  const selectDevice = useCallback((device: Input | null) => {
    if (selectedDevice) {
      selectedDevice.removeListener();
    }

    setState((draft) => {
      draft.selectedDevice = device;
    });
  }, []);

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        toast.success(t("notification_messages.webmidi_enabled"));

        WebMidi.addListener("connected", () => {
          setState((draft) => {
            draft.devices = _.clone(WebMidi.inputs);
          });
        });

        WebMidi.addListener("disconnected", () => {
          setState((draft) => {
            draft.devices = _.clone(WebMidi.inputs);
          });
        });

        setState((draft) => {
          draft.devices = _.clone(WebMidi.inputs);
        });
      })
      .catch(() => {
        toast.error(t("client_error_messages.webmidi_failed"));
      });

    return () => {
      WebMidi.removeListener("connected");
      WebMidi.removeListener("disconnected");
      WebMidi.disable();
    };
  }, []);

  return (
    <MidiContext.Provider value={{ devices, selectedDevice, selectDevice }}>
      {children}
    </MidiContext.Provider>
  );
}
