"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  CircleAlertIcon,
  CircleQuestionMarkIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { createContext, type PropsWithChildren, use, useState } from "react";

type AlertType = "confirm" | "alert" | "prompt";

type Options = {
  title: string;
  description?: string;
  okText?: string;
  type?: AlertType;
  cancelText?: string;
  variant?: "default" | "destructive";
};

type ContextValueProps = {
  confirm: (options: Options) => Promise<string>;
  alert: (options: Options) => Promise<string>;
  prompt: (options: Options) => Promise<string>;
};

const AlerterContext = createContext<ContextValueProps>({
  confirm: () => new Promise((resolve) => resolve("")),
  alert: () => new Promise((resolve) => resolve("")),
  prompt: () => new Promise((resolve) => resolve("")),
});

export function AlerterProvider({ children }: PropsWithChildren) {
  const [isOpen, setOpen] = useState(false);
  const [options, setOptions] = useState<Options>();
  const [resolver, setResolver] = useState<(value: string) => void>(() => {});

  //   type     destructive       default
  // --------------------------------------------
  // confirm     Triangle        CircleAlert
  // alert       Octagon-X       CircleAlert
  // prompt      CircleQuestion  CircleQuestion
  const variantIcon = () => {
    if (options?.type === "prompt") return <CircleQuestionMarkIcon />;
    if (options?.variant === "destructive")
      return options?.type === "confirm" ? (
        <TriangleAlertIcon />
      ) : (
        <OctagonXIcon />
      );

    return <CircleAlertIcon />;
  };

  const setup = (options: Options, type: AlertType) =>
    new Promise<string>((resolve) => {
      setOptions({ ...options, type });
      setResolver(() => resolve);
      setOpen(true);
    });

  // 먼저 close되고 0.1초 후 promise 실행하여 도시에 2개의 AlertDialog가 뜨는 걸 방지한다!
  const makeResolver = (value: string) => setTimeout(resolver, 1000, value);

  const confirm = (options: Options) => setup(options, "confirm");
  const alert = (options: Options) => setup(options, "alert");
  const prompt = (options: Options) => setup(options, "prompt");

  return (
    <AlerterContext.Provider value={{ confirm, alert, prompt }}>
      {children}

      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent className="w-80 translate-y-[-150px] sm:w-96">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={cn("flex items-center gap-2", {
                "text-destructive": options?.variant === "destructive",
              })}
            >
              {variantIcon()}
              {options?.title}
            </AlertDialogTitle>
            {options?.description && (
              <AlertDialogDescription>
                {options.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {options?.type !== "alert" && (
              <AlertDialogCancel onClick={() => makeResolver("")}>
                {options?.cancelText ?? "Cancel"}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={() => makeResolver("OK")}
              className={cn(
                options?.variant === "destructive" &&
                  "bg-destructive hover:bg-destructive/90 dark:bg-destructive/60",
              )}
            >
              {options?.okText ?? "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlerterContext.Provider>
  );
}

export const useAlerter = () => use(AlerterContext);
