import {
  FloatingArrow,
  ReferenceType,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface Props {
  children: (props: {
    setReference: (node: ReferenceType | null) => void;
    getReferenceProps: () => Record<string, unknown>;
  }) => React.ReactNode;
  popoverContent: React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
}

interface Methods {
  updatePosition: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const Popover = forwardRef<Methods, Props>(
  ({ children, popoverContent, placement = "right", ...restProps }, ref) => {
    const arrowRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const { x, y, strategy, refs, context, update } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: placement,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(10),
        flip(),
        shift(),
        arrow({
          element: arrowRef,
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

    useImperativeHandle(ref, () => ({
      updatePosition: update,
      setOpen: setIsOpen,
    }));

    return (
      <>
        <div {...restProps}>
          {children({ setReference: refs.setReference, getReferenceProps })}
        </div>
        {isMounted && (
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            className="bg-shade-300 drop-shadow-xl rounded-2xl overflow-hidden z-20"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...styles,
            }}
          >
            <FloatingArrow width={20} ref={arrowRef} context={context} />

            {popoverContent}
          </div>
        )}
      </>
    );
  }
);
