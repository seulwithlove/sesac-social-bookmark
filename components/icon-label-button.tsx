"use client";

import { cn } from "@/lib/utils";
import type { JSX, MouseEvent, PropsWithChildren } from "react";
import IconLabel, { type IconNoti } from "./icon-label";
import ToolTip from "./tool-tip";
import { Button } from "./ui/button";

type Props = {
  icon: JSX.Element;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  isDanger?: boolean;
  tooltip?: string;
  noti?: IconNoti;
  disabled?: boolean;
};

export default function IconLabelButton({
  icon,
  onClick,
  isActive,
  isDanger,
  tooltip,
  noti,
  disabled,
  children,
}: PropsWithChildren<Props>) {
  return (
    <ToolTip
      content={tooltip}
      disabled={!tooltip}
      variant={isDanger ? "destructive" : "default"}
    >
      <Button
        onClick={onClick}
        variant={"ghost"}
        className={cn(
          "h-[80%] dark:hover:bg-muted-foreground/30",
          isDanger && "text-destructive",
          noti ? "px-2" : "px-1 py-1",
          { "px-2": !children },
        )}
        disabled={disabled}
      >
        <IconLabel icon={icon} isActive={isActive} isDanger={isDanger} noti={noti}>
          {children}
        </IconLabel>
      </Button>
    </ToolTip>
  );
}
