import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik, FormikProvider } from "formik";
import { Avatar } from "../Avatar";
import { v4 as uuidv4 } from "uuid";
import TextField from "../form/fields/TextField";
import * as Yup from "yup";

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  starWars,
} from "unique-names-generator";
import { IIdentity } from "../../types";
import { Button } from "../form/Button";

interface Props {
  isOpen: boolean;
  onIdentityCreated: (identity: any) => void;
}

export function CreateIdentityModal({ isOpen, onIdentityCreated }: Props) {
  const { t } = useTranslation();

  const defaultAvatarSeed = uuidv4();

  const identityForm = useFormik<IIdentity>({
    initialValues: {
      nickname: uniqueNamesGenerator({
        separator: "",
        style: "capital",
        dictionaries: [adjectives, animals],
      }),
      avatarSeed: defaultAvatarSeed,
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .required(t("validation_rules.required"))
        .min(3, t("validation_rules.min_char", { min: 3 }))
        .max(32, t("validation_rules.max_char", { max: 32 }))
        .trim(),
      avatarSeed: Yup.string().uuid().required(),
    }),
    onSubmit: (values) => {
      onIdentityCreated(values);
    },
  });

  function randomizeSize(e) {
    e.preventDefault();

    identityForm.setFieldValue("avatarSeed", uuidv4());
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto dark:text-slate-300 text-slate-700">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-base-200 dark:bg-base-800 p-10 text-left align-middle shadow-xl transition-all">
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
                          onClick={randomizeSize}
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
                      {t("create_identity_modal.join_game")}
                    </Button>
                  </form>
                </FormikProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CreateIdentityModal;
