"use client";

import { resetPassword } from "@/app/sign/sign.action";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

type Props = {
  email: string;
  emailcheck: string;
};

export default function ResetPassword({ email, emailcheck }: Props) {
  const [validError, resetPasswordAction, isPending] = useActionState(
    resetPassword,
    undefined,
  );

  const sendAction = async (formData: FormData) => {
    formData.set("email", email);
    formData.set("emailcheck", emailcheck);
    resetPasswordAction(formData);
  };

  return (
    <form action={sendAction} className="">
      <LabelInput
        label="new password"
        name="passwd"
        type="password"
        focus={true}
        error={validError}
        placeholder="new password..."
      />
      <LabelInput
        label="new password confirm"
        name="passwd2"
        type="password"
        error={validError}
        placeholder="new password confirm..."
        className="mt-5"
      />

      <Button
        type="submit"
        variant={"destructive"}
        className="disabled={isPending} my-5 w-full"
        disabled={isPending}
      >
        Change Password
      </Button>
    </form>
  );
}
