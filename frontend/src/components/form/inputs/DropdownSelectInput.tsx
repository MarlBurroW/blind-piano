import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Option<ValueType, PayloadType> = {
  label: string;
  value: ValueType;
  payload: PayloadType;
};

interface Props<ValueType, PayloadType> {
  options: Array<Option<ValueType, PayloadType>>;
  value: ValueType;
  onChange?: (value: ValueType, payload: PayloadType) => void;
  placeholder?: string;
  renderItem?: (
    option: Option<ValueType, PayloadType>,
    isSelected: boolean
  ) => React.ReactNode;
}
export const DropdownSelectInput = <ValueType, PayloadType>({
  options,
  value,
  onChange,
  placeholder,
  renderItem,
}: Props<ValueType, PayloadType>) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context, update } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      offset(10),
      shift(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 200,
  });

  const selectedOpion = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  const handleSelect = useCallback(
    (value: ValueType, payload: PayloadType) => {
      onChange?.(value, payload);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <>
      <div
        tabIndex={0}
        ref={refs.setReference}
        {...getReferenceProps()}
        className="relative cursor-pointer ring-primary-300 text-left focus:ring w-full bg-shade-200  py-4 px-5 rounded-3xl"
      >
        {selectedOpion ? selectedOpion.label : placeholder ?? "Select"}
      </div>
      {isMounted && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps()}
          className="bg-shade-200 w-full drop-shadow-xl rounded-2xl overflow-hidden z-20"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            ...styles,
          }}
        >
          {options.map(option => {
            return renderItem ? (
              <div
                className="cursor-pointer"
                key={JSON.stringify(option.value)}
                onClick={() => handleSelect(option.value, option.payload)}
              >
                {renderItem(option, option.value === value)}
              </div>
            ) : (
              <div
                key={JSON.stringify(option.value)}
                className={`${
                  option.value === value
                    ? "bg-primary-500 "
                    : "hover:bg-shade-300"
                } py-4 px-4  cursor-pointer`}
                onClick={() => handleSelect(option.value, option.payload)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default DropdownSelectInput;
