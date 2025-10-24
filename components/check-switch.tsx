"use client";

import type { ValidError } from "@/lib/validator";
import { useEffect, useId, useState, type RefObject } from "react";
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
  const { errors, value } =
    !!error && !!name && error[name] ? error[name] : { errors: [] };
  const [checked, setChecked] = useState(checkValue || !!value);

  const Compo = type === "checkbox" ? Checkbox : Switch;

  // checkValue prop이 변경될때만 상태 업데이트
  useEffect(() => {
    setChecked(checkValue || !!value);
  }, [checkValue, value]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <Compo
          id={uid}
          name={(type === "switch" && !!name ? name : null) || uid}
          ref={ref}
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(!!checked);
            if (setCheckedFunction) setCheckedFunction(!!checked);
          }}
        />

        <Label htmlFor={uid} className="cursor-pointer capitalize">
          {label}
        </Label>
        {!!name && (
          <Input type="hidden" name={name} value={checked ? "on" : ""} />
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
