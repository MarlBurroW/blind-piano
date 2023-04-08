import { Dialog, Transition } from "@headlessui/react";
import { FormikProvider, useFormik } from "formik";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

import { colors } from "../../../../common/colors";
import { IIdentity } from "../../../../common/types";
import { useColors } from "../../hooks/hooks";
import { Avatar } from "../Avatar";
import { Panel } from "../Panel";
import { Button } from "../form/Button";
import { FieldLabel } from "../form/FieldLabel";
import TextField from "../form/fields/TextField";
import { BaseModal } from "./BaseModal";

interface Props {
  isOpen: boolean;
  mandatory?: boolean;
  onIdentityValidated: (identity: IIdentity) => void;
  onClose?: () => void;
  defaultIdentity?: IIdentity | null;
}

export function CreateIdentityModal({
  isOpen,
  onIdentityValidated,
  onClose,
  defaultIdentity,
}: Props) {
  const { t } = useTranslation();

  const [storedNickname, setStoredNickname] = useLocalStorage<string | null>(
    "nickname",
    null
  );
  const [storedAvatarSeed, setStoredAvatarSeed] = useLocalStorage<
    string | null
  >("avatarSeed", null);

  const { availableColors } = useColors();

  const identityForm = useFormik<IIdentity>({
    initialValues: {
      nickname: storedNickname
        ? storedNickname
        : uniqueNamesGenerator({
            separator: " ",
            style: "capital",
            dictionaries: [adjectives, animals],
          }),
      avatarSeed: storedAvatarSeed ? storedAvatarSeed : uuidv4(),
      color:
        availableColors[Math.floor(Math.random() * availableColors.length)],
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .required(t("validation_rules.required"))
        .min(3, t("validation_rules.min_char", { min: 3 }))
        .max(32, t("validation_rules.max_char", { max: 32 }))
        .trim(),
      avatarSeed: Yup.string().uuid().required(),
      color: Yup.string().required().oneOf(colors),
    }),
    onSubmit: identity => {
      onIdentityValidated(identity);
      setStoredNickname(identity.nickname);
      setStoredAvatarSeed(identity.avatarSeed);
    },
  });

  function randomizeSeed(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    identityForm.setFieldValue("avatarSeed", uuidv4());
  }

  useEffect(() => {
    // Check if current selected color still available and if not, select a new one

    if (!availableColors.includes(identityForm.values.color)) {
      identityForm.setFieldValue(
        "color",
        availableColors[Math.floor(Math.random() * availableColors.length)]
      );
    }
  }, [availableColors]);

  useEffect(() => {
    if (isOpen && defaultIdentity) {
      identityForm.setFieldValue("avatarSeed", defaultIdentity.avatarSeed);
      identityForm.setFieldValue("nickname", defaultIdentity.nickname);
      identityForm.setFieldValue("color", defaultIdentity.color);
    }
  }, [isOpen, defaultIdentity]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={45}>
      <Panel style="primary" neon padding={10}>
        <FormikProvider value={identityForm}>
          <form onSubmit={identityForm.handleSubmit}>
            <Dialog.Title className="text-lg font-medium  text-center mb-10 ">
              <div className="text-5xl font-black">
                {t("create_identity_modal.title")}
              </div>
            </Dialog.Title>

            <div className="w-full p10">
              <div className="p-10 flex justify-center flex-col">
                <Avatar
                  className="mb-5 w-8xl block mx-auto"
                  circle={true}
                  background={true}
                  seed={identityForm.values.avatarSeed}
                  size={320}
                />
                <Button
                  size="sm"
                  style="secondary"
                  type="button"
                  onClick={randomizeSeed}
                  fullWidth={false}
                  className="w-32 mx-auto"
                >
                  {t("create_identity_modal.randomize_avatar")}
                </Button>
              </div>
              <FieldLabel
                className="text-center"
                label={t("generic.nickname")}
              />
              <TextField
                className="input-lg text-center"
                labelClassName={"text-center"}
                placeholder={t("create_identity_modal.nickname_placeholder")}
                name="nickname"
              ></TextField>
              <FieldLabel className="text-center" label={t("generic.color")} />
              <div className="flex justify-between py-5 px-2 mb-5">
                {availableColors.map(color => {
                  return (
                    <div
                      key={color}
                      onClick={() => identityForm.setFieldValue("color", color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 w-8 rounded-full transition-all cursor-pointer ${
                        identityForm.values.color === color ? "scale-150" : ""
                      }`}
                    ></div>
                  );
                })}
              </div>
            </div>

            <Button fullWidth type="submit" disabled={!identityForm.isValid}>
              {t("create_identity_modal.validate_identity")}
            </Button>
          </form>
        </FormikProvider>
      </Panel>
    </BaseModal>
  );
}

export default CreateIdentityModal;
