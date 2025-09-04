import {
  type ComponentProps,
  type HTMLElementType,
  type RefObject,
  useId,
} from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  name?: string;
  ref?: RefObject<HTMLElementType | null>;
  placeholder?: string;
  className?: string;
};

export default function LabelInput({
  label,
  name,
  type,
  ref,
  placeholder,
  className,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqName = useId();
  // const ref = useRef<HTMLElementType>(null)
  return (
    <label htmlFor={uniqName} className="font-semibold text-sm capitalize">
      {type}
      <Input
        type={type || "text"}
        id={uniqName}
        name={name || uniqName}
        ref={ref}
        placeholder={placeholder || ""}
        className={cn("bg-gray font-normal focus:bg-white", className)}
        {...props}
      />
    </label>
  );
}
