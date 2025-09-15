/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect dep-arr */
"use client";

import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import {
  type ComponentProps,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from "react";
import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  name?: string;
  ref?: RefObject<HTMLInputElement | null>;
  focus?: boolean;
  defaultValue?: string | number;
  error?: ValidError;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export default function LabelInput({
  label,
  type,
  name,
  ref,
  focus,
  defaultValue,
  error,
  placeholder,
  className,
  inputClassName,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqName = useId();
  const inpRef = useRef<HTMLInputElement>(null);

  const err = !!error && !!name && error[name] ? error[name].errors : [];
  const val =
    !!error && !!name && error[name] ? error[name].value?.toString() : "";

  useEffect(() => {
    if (!focus && !err.length) return;

    const keys = Object.keys(error ?? {});
    console.log("*********", keys); // check how many times rendered

    if (!focus && (!err.length || keys[0] !== name)) return;

    if (ref) ref.current?.focus();
    else inpRef.current?.focus();
  }, [err]);

  return (
    <div className={cn(className)}>
      <label htmlFor={uniqName} className="font-semibold text-sm capitalize">
        {label}
        <Input
          type={type || "text"}
          id={uniqName}
          name={name || uniqName}
          ref={ref || inpRef}
          defaultValue={val || defaultValue}
          placeholder={placeholder || ""}
          className={cn("bg-gray font-normal focus:bg-white", inputClassName)}
          {...props}
        />
        {err.map((e) => (
          <small key={e} className="ml-1 text-red-400">
            {e}
          </small>
        ))}
      </label>
    </div>
  );
}
