import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

// Utility function to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      {...props}
    />
  );
}

export default Separator;