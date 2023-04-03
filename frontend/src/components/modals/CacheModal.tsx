import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "../Panel";
import { Button } from "../form/Button";
import { usePlayers } from "../../hooks/hooks";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { ICachableResource } from "../../../../common/types";
import { ProgressBar } from "../ProgressBar";

import { State as ServiceWorkerState } from "../context/ServiceWorkerContext";
import { BsCloudCheck } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useLocalStorage } from "usehooks-ts";
import { AnimatePresence, motion } from "framer-motion";
import { CheckBoxInput } from "../form/inputs/CheckBoxInput";
import { AiOutlineWarning } from "react-icons/ai";
import prettyBytes from "pretty-bytes";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onStartCaching: () => void;
  cachingState: ServiceWorkerState;
}
import _ from "lodash";

export function CacheModal({
  isOpen,
  onClose,
  onStartCaching,
  cachingState,
}: Props) {
  const { t } = useTranslation();

  const [askDisabled, setAskDisabled] = useLocalStorage<boolean>(
    "cache-ask-disabled",
    false
  );

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
              <Dialog.Panel className="w-full max-w-[50rem]">
                <Panel
                  style="primary"
                  neon
                  className="text-center"
                  padding={10}
                >
                  <Dialog.Title className="text-lg font-medium  text-center mb-5 ">
                    <div className="text-3xl font-black">
                      {t("cache_modal.title")}
                    </div>
                  </Dialog.Title>

                  <p className="font-thin text-center mb-5 text-xl">
                    {t("cache_modal.cache_description")}
                  </p>

                  {cachingState.cacheStatus && !cachingState.running && (
                    <div className="flex flex-col items-center">
                      <div className="font-normal text-center mb-6 text-xl">
                        {cachingState.checking ? (
                          <div className="flex items-center">
                            {t("cache_modal.checking_cache")}
                          </div>
                        ) : (
                          <>
                            {cachingState.cacheStatus.cached == 0 && (
                              <>{t("cache_modal.no_resource_cached")}</>
                            )}
                            {cachingState.cacheStatus.cached > 0 && (
                              <>
                                {t("cache_modal.cache_status")}:{" "}
                                {cachingState.cacheStatus.cached}/
                                {cachingState.cacheStatus.cached +
                                  cachingState.cacheStatus.notCached}
                                {cachingState.cacheStatus.notCached > 0 && (
                                  <div className="flex">
                                    <AiOutlineWarning className="mr-2"></AiOutlineWarning>{" "}
                                    {t("cache_modal.some_resources_not_cached")}
                                  </div>
                                )}
                                {cachingState.cacheStatus.notCached == 0 && (
                                  <div className="flex text-green-400 justify-center">
                                    <BsCloudCheck className="mr-2 h-6 w-6"></BsCloudCheck>{" "}
                                    {t("cache_modal.all_resources_cached")}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {cachingState.running && (
                    <div>
                      <ProgressBar
                        className="mb-4"
                        min={0}
                        max={cachingState.total}
                        value={cachingState.cachedCount}
                      ></ProgressBar>
                      <div className="font-thin">
                        {t("cache_modal.resource")}:{" "}
                        {cachingState.nextResource
                          ? cachingState.nextResource.name
                          : t("cache_modal.completed")}
                      </div>

                      <div className="font-thin">
                        {t("cache_modal.progress")}:{" "}
                        {!cachingState.completed
                          ? `${cachingState.cachedCount}/${
                              cachingState.total
                            } (${Math.round(cachingState.progress * 100)}%)`
                          : t("cache_modal.completed")}
                      </div>
                      <div className="font-thin">
                        {t("cache_modal.cache_size")}:{" "}
                        {prettyBytes(cachingState.size)}
                      </div>
                    </div>
                  )}

                  {!cachingState.running && !cachingState.completed && (
                    <div className="flex flex-col items-center">
                      {cachingState.cacheStatus &&
                        cachingState.cacheStatus.notCached > 0 && (
                          <>
                            <Button
                              onClick={onStartCaching}
                              className="flex items-center mx-auto mb-5"
                              style="primary"
                            >
                              <AiOutlineCloudDownload className="h-8 w-8 mr-4"></AiOutlineCloudDownload>
                              {t("cache_modal.start_caching")}
                            </Button>
                            <Button
                              onClick={onClose}
                              className="flex items-center mx-auto mb-5"
                              style="neutral"
                            >
                              {t("cache_modal.not_now")}
                            </Button>

                            <CheckBoxInput
                              label={t("cache_modal.dont_ask_later")}
                              value={askDisabled}
                              onChange={setAskDisabled}
                            ></CheckBoxInput>
                          </>
                        )}
                    </div>
                  )}

                  {cachingState.completed && (
                    <div className="font-thin flex flex-col  items-center">
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <BsCloudCheck className="text-green-400 h-[15rem] w-[15rem]"></BsCloudCheck>
                        </motion.div>
                      </AnimatePresence>
                      <div className="text-4xl text-green-400">
                        {t("cache_modal.completed")}
                      </div>
                      <div className=" mb-5">
                        <div className="text-green-400 font-light">
                          {t("cache_modal.cachedCount")}:{" "}
                          {cachingState.cachedCount} / {cachingState.total}
                        </div>
                        {cachingState.errorCount > 0 && (
                          <div className="text-red-400 font-light">
                            {t("cache_modal.errorCount")}:{" "}
                            {cachingState.errorCount}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={onClose}
                        className="px-10 flex items-center mx-auto"
                        style="neutral"
                        size="md"
                      >
                        {t("cache_modal.close_modal")}
                      </Button>
                    </div>
                  )}
                </Panel>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CacheModal;
