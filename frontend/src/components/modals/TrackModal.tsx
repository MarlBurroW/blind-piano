import { Dialog } from "@headlessui/react";
import { FormikProvider, useFormik } from "formik";
import _ from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { Track } from "../../../../backend/schemas/Track";
import { Panel } from "../Panel";
import { Button } from "../form/Button";
import { PatchField } from "../form/fields/PatchField";
import { PlayerField } from "../form/fields/PlayerField";
import TextField from "../form/fields/TextField";
import { BaseModal } from "./BaseModal";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  track: Track | null;
  onCreated?: (track: Track) => void;
}

export function TrackModal({ isOpen, onClose, track, onCreated }: Props) {
  const { t } = useTranslation();

  const close = useCallback(() => {
    onClose?.();
    trackForm.resetForm();
  }, [onClose]);

  const trackForm = useFormik({
    initialValues: {},
    validationSchema: Yup.object({
      name: Yup.string()
        .required(t("validation_rules.required"))
        .min(1, t("validation_rules.min_char", { min: 1 }))
        .max(32, t("validation_rules.max_char", { max: 32 }))
        .trim(),
      patch: Yup.string().required(),
      playerId: Yup.string().nullable(),
    }),
    onSubmit: track => {
      onCreated?.(track as Track);
      close();
      trackForm.resetForm();
    },
  });

  return (
    <BaseModal
      isOpen={isOpen}
      size={40}
      onClose={() => {
        onClose?.();
        trackForm.resetForm();
      }}
    >
      <Panel style="primary" neon className="text-left" padding={10}>
        <FormikProvider value={trackForm}>
          <form onSubmit={trackForm.handleSubmit}>
            <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
              <div className="text-5xl font-black">
                {track
                  ? t("track_modal.edit_track")
                  : t("track_modal.create_track")}
              </div>
            </Dialog.Title>
            <div className="mb-10">
              <TextField
                labelClassName={"text-center"}
                placeholder={t("track_modal.track_name")}
                name="name"
                label={t("track_modal.track_name")}
              ></TextField>
              <PatchField
                label={t("generic.instrument")}
                name="patch"
              ></PatchField>

              <PlayerField
                label={t("track_modal.assigned_player")}
                name="playerId"
              ></PlayerField>
            </div>
            <Button fullWidth type="submit" disabled={!trackForm.isValid}>
              {track
                ? t("track_modal.edit_track")
                : t("track_modal.create_track")}
            </Button>
          </form>
        </FormikProvider>
      </Panel>
    </BaseModal>
  );
}

export default TrackModal;
