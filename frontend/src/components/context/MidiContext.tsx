import EventEmitter from "eventemitter3";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DraftFunction, useImmer } from "use-immer";
import { WebMidi } from "webmidi";
import type { Input } from "webmidi";

interface IMidiContext {
  devices: Array<Input>;
  selectedDevice: Input | null;
  selectDevice: (device: Input | null) => void;
  midiBus$: EventEmitter | null;
}

const initialContextValues = {
  devices: [],
  selectedDevice: null,
  selectDevice: () => {},
  midiBus$: null,
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

  const midiBusRef = useRef(new EventEmitter());

  const selectDevice = useCallback((device: Input | null) => {
    if (selectedDevice) {
      selectedDevice.removeListener();
    }

    setState(draft => {
      draft.selectedDevice = device;
    });
  }, []);

  function autoSelectDevice(draft: State) {
    if (!draft.selectedDevice) {
      if (draft.devices.length > 0) {
        draft.selectedDevice = draft.devices[0];
      }
    } else {
      if (draft.devices.length === 0) {
        draft.selectedDevice = null;
      }
    }
  }

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        toast.success(t("notification_messages.webmidi_enabled"));

        WebMidi.addListener("connected", () => {
          setState(draft => {
            draft.devices = _.clone(WebMidi.inputs);

            autoSelectDevice(draft as State);
          });
        });

        WebMidi.addListener("disconnected", () => {
          setState(draft => {
            draft.devices = _.clone(WebMidi.inputs);
            autoSelectDevice(draft as State);
          });
        });

        setState(draft => {
          draft.devices = _.clone(WebMidi.inputs);
          autoSelectDevice(draft as State);
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
    <MidiContext.Provider
      value={{
        devices,
        midiBus$: midiBusRef.current,
        selectedDevice,
        selectDevice,
      }}
    >
      {children}
    </MidiContext.Provider>
  );
}
