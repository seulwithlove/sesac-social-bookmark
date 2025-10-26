import { cn } from "@/lib/utils";
import { cloneElement, type JSX, type PropsWithChildren } from "react";

type Prop = {
  icon: JSX.Element;
  size?: number;
  noti?: "default" | "muted" | "primary" | "destructive" | "success";
  isActive?: boolean;
  isDanger?: boolean;
};

export default function IconLabel({
  icon,
  size,
  noti,
  isActive,
  isDanger,
  children,
}: PropsWithChildren<Prop>) {
  const lucideIcon = cloneElement(icon, {
    className: cn(
      "text-muted-foreground",
      isDanger && "text-destructive",
      isActive && "fill-primary",
      { "mr-1": !!noti, "mr-[.2rem]": !!children || children === 0 },
      icon.props?.className,
    ),
    size: size ?? (noti ? 28 : 20),
  });

  return (
    <div className="relative flex items-center text-muted-foreground">
      {lucideIcon}
      {noti ? (
        <small
          className={cn(
            "absolute top-0 right-0 min-w-5 rounded-full p-0 text-center text-sm text-white tracking-tighter ring-1",
            `translate-x-2 translate-y-[-0.4rem]`,
            {
              "bg-primary": noti === "default",
              "bg-muted": noti === "muted",
              "bg-destructive": noti === "destructive",
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
