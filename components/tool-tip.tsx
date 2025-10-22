import type { PropsWithChildren, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ToolTip({
  content,
  children,
}: PropsWithChildren<{ content: ReactNode }>) {
  return (
    <Tooltip open={true}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent
        className="bg-red-500"
        arrowClassName="fill-red-500 bg-red-500"
      >
        Open with deletion!
      </TooltipContent>
    </Tooltip>
  );
}
