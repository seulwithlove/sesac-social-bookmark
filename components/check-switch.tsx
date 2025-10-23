"use client";

import type { ValidError } from "@/lib/validator";
import { useId, useState, type RefObject } from "react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type Props = {
  name?: string;
  label?: string;
  type?: "checkbox" | "switch";
  ref?: RefObject<HTMLButtonElement>;
  error?: ValidError;
  checkValue?: boolean;
  setCheckedFunction?: (checked: boolean) => void;
};

/**
 * @ usage <CheckSwitch type='switch' name='' label='xx' />
 *
 */

export default function CheckSwitch({
  name,
  label,
  type = "checkbox",
  ref,
  error,
  checkValue,
  setCheckedFunction,
}: Props) {
  const uid = useId();
  const [checked, setChecked] = useState(checkValue);

  const { errors, value } =
    !!error && !!name && error[name] ? error[name] : { errors: [] };
  const Compo = type === "checkbox" ? Checkbox : Switch;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Compo
          id={uid}
          name={type === "checkbox" && !!name ? uid : name || uid}
          ref={ref}
          checked={checked || !!value}
          onCheckedChange={(checked) => {
            setChecked(!!checked);
            if (setCheckedFunction) setCheckedFunction(!!checked);
          }}
        />

        <Label htmlFor={uid} className="cursor-pointer">
          {label}
        </Label>
        {type === "checkbox" && !!name && (
          <Input
            type="hidden"
            name={name}
            value={checked || !!value ? "on" : ""}
          />
        )}
      </div>
      {errors?.map((e) => (
        <p key={e} className="mt-1 text-red-400 text-sm">
          {e}
        </p>
      ))}
    </div>
  );
}
