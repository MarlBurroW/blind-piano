import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  size?: number;
}

export function BaseModal({ isOpen, onClose, children, size = 40 }: Props) {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  const handleExited = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={handleExited}>
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

        {isRendered && (
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
                <Dialog.Panel
                  className="w-full"
                  style={{ maxWidth: size + "rem" }}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        )}
      </Dialog>
    </Transition>
  );
}

export default BaseModal;
