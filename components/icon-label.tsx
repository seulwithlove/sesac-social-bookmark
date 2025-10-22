import { cn } from "@/lib/utils";
import { cloneElement, type JSX, type PropsWithChildren } from "react";

type Prop = {
  icon: JSX.Element;
  size?: number;
  noti?: "default" | "muted" | "primary" | "destructive" | "success";
};

export default function IconLabel({
  icon,
  size = 24,
  noti,
  children,
}: PropsWithChildren<Prop>) {
  const lucideIcon = cloneElement(icon, {
    className: cn("text-muted-foreground mr-1", icon.props.className),
    size,
  });

  return (
    <div className="relative flex items-center">
      {lucideIcon}
      {noti ? (
        <small
          className={cn(
            "absolute top-0 right-0 min-w-5 rounded-full p-0 text-center text-sm text-white tracking-tighter ring-1",
            `translate-x-2.5 translate-y-[-0.4rem]`,
            {
              "bg-black": noti === "default",
              "bg-gray-500": noti === "muted",
              "bg-red-500": noti === "destructive",
              "bg-blue-500": noti === "primary",
              "bg-green-500": noti === "success",
            },
          )}
        >
          {children}
        </small>
      ) : (
        children
      )}
    </div>
  );
}
