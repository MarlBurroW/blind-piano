import {
  FloatingArrow,
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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  popoverContent: React.ReactNode;
}

export const Popover = forwardRef(
  ({ children, popoverContent, ...restProps }: Props, ref) => {
    const arrowRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const { x, y, strategy, refs, context, update } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: "right",
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
    }));

    return (
      <>
        <div {...restProps} ref={refs.setReference} {...getReferenceProps()}>
          {children}
        </div>
        {isMounted && (
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            className="bg-shade-300 drop-shadow-xl rounded-2xl overflow-hidden"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...styles,
            }}
          >
            <FloatingArrow
              className="fill-shade-300 drop-shadow-xl"
              width={20}
              ref={arrowRef}
              context={context}
            />
            {popoverContent}
          </div>
        )}
      </>
    );
  }
);
