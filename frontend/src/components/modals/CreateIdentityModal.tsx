import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik, FormikProvider } from "formik";
import { Avatar } from "../Avatar";
import { v4 as uuidv4 } from "uuid";
import TextField from "../form/fields/TextField";
import * as Yup from "yup";
import { useLocalStorage } from "usehooks-ts";

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { IIdentity } from "../../types";
import { Button } from "../form/Button";
import { Panel } from "../Panel";

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
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .required(t("validation_rules.required"))
        .min(3, t("validation_rules.min_char", { min: 3 }))
        .max(32, t("validation_rules.max_char", { max: 32 }))
        .trim(),
      avatarSeed: Yup.string().uuid().required(),
    }),
    onSubmit: (identity) => {
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
    if (isOpen && defaultIdentity) {
      identityForm.setFieldValue("avatarSeed", defaultIdentity.avatarSeed);
      identityForm.setFieldValue("nickname", defaultIdentity.nickname);
    }
  }, [isOpen, defaultIdentity]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 text-white"
        onClose={onClose ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl">
                <Panel style="primary" neon className="text-left " padding={10}>
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

                        <TextField
                          className="input-lg text-center"
                          label={t("generic.nickname")}
                          placeholder={t(
                            "create_identity_modal.nickname_placeholder"
                          )}
                          name="nickname"
                        ></TextField>
                      </div>

                      <Button
                        fullWidth
                        type="submit"
                        disabled={!identityForm.isValid}
                      >
                        {t("create_identity_modal.validate_identity")}
                      </Button>
                    </form>
                  </FormikProvider>
                </Panel>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CreateIdentityModal;
