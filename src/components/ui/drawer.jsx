import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../../lib/utils";

const Drawer = ({ ...props }) => (
  <DrawerPrimitive.Root {...props} />
);

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;
const DrawerPortal = DrawerPrimitive.Portal;

const DrawerOverlay = ({ className, ...props }) => (
  <DrawerPrimitive.Overlay
    className={cn("fixed inset-0 z-50 bg-black/50", className)}
    {...props}
  />
);

const DrawerContent = ({ className, children, ...props }) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex flex-col",
        "bg-bg-raised border-t border-border rounded-t-xl",
        "max-h-[85vh]",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-border-bright" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);

const DrawerHeader = ({ className, ...props }) => (
  <div
    className={cn("px-4 pb-3 border-b border-border", className)}
    {...props}
  />
);

const DrawerBody = ({ className, ...props }) => (
  <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />
);

const DrawerFooter = ({ className, ...props }) => (
  <div
    className={cn("p-4 border-t border-border flex gap-3", className)}
    {...props}
  />
);

const DrawerTitle = ({ className, ...props }) => (
  <DrawerPrimitive.Title
    className={cn("font-display text-base font-bold tracking-wide", className)}
    {...props}
  />
);

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
};
