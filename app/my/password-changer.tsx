"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import { useActionState, type ActionDispatch, type FormEvent } from "react";
import { updatePassword } from "../sign/sign.action";

export default function PasswordChanger({
  toggleEditing,
}: {
  toggleEditing: ActionDispatch<[]>;
}) {
  const [validError, changePassword, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      const err = await updatePassword(formData);
      if (err) return err;
      toggleEditing();
    },
    undefined,
  );
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    changePassword(formData);
  };
  return (
    <form className="rounded-md border-2 border-red-300">
      <LabelInput
        label="Current Password"
        name="curr_passwd"
        type="password"
        error={validError}
        placeholder="current password..."
      />
      <LabelInput
        label="New Password"
        name="passwd"
        type="password"
        error={validError}
        placeholder="new password..."
      />
      <LabelInput
        label="New Password Confirm"
        name="passwd2"
        type="password"
        error={validError}
        placeholder="new password confirm..."
      />

      <div className="mt-4 flex justify-center gap-5">
        <Button onClick={toggleEditing} type="reset" variant={"outline"}>
          <UndoDotIcon /> Cancel
        </Button>
        <Button type="submit" variant={"destructive"} disabled={isPending}>
          <CheckLineIcon /> Change Password
        </Button>
      </div>
    </form>
  );
}
