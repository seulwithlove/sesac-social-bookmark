"use client";

import { cn } from "@/lib/utils";
import { useState, type PropsWithChildren, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ToolTip({
  content,
  variant,
  disabled,
  children,
}: PropsWithChildren<{
  content: ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
}>) {
  const [isOpen, setOpen] = useState(false);

  const doOpen = (openState: boolean) => {
    setOpen(disabled ? false : openState);
  };
  return (
    <Tooltip open={isOpen} onOpenChange={doOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn(
          "text-white",
          variant === "destructive" && "bg-destructive",
        )}
        arrowClassName={cn(
          variant === "destructive" && "fill-destructive bg-destructive",
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
