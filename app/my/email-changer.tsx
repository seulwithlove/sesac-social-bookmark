"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  type ActionDispatch,
  type FormEvent,
  type MouseEvent,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import { flushSync } from "react-dom";
import { sendEmailChangeCode, updateEmail } from "../sign/sign.action";

type Props = {
  email: string | null | undefined;
  toggleEditing: ActionDispatch<[]>;
};

export default function EmailChanger({ email, toggleEditing }: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [diffEmail, setDiffEmail] = useState(false);
  const [didSendCode, toggleSendCode] = useReducer((pre) => !pre, false); // QQQ: false
  const [validError, setValidError] = useState<ValidError>();

  const formRef = useRef<HTMLFormElement>(null);
  const [submitType, setSubmitType] = useState<"sendmail" | "confirm">(
    "sendmail",
  );

  const [isSending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    console.log("email changer : ##############", submitType);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("*", Object.fromEntries(formData.entries()));
    startTransition(async () => {
      if (submitType === "sendmail") {
        const err = await sendEmailChangeCode(formData);
        if (err) setValidError(err);
        else toggleSendCode();
      } else if (submitType === "confirm") {
        const [err, mbr] = await updateEmail(formData);

        if (err) {
          setValidError(err);
        } else {
          await update(mbr);
          router.refresh();
        }
      }
    });
  };

  const sendmail = (e: MouseEvent) => {
    e.preventDefault();
    setSubmitType(() => "sendmail");
    formRef.current?.requestSubmit();
  };

  const confirmAndSave = (e: MouseEvent) => {
    e.preventDefault();
    flushSync(() => setSubmitType("confirm"));
    formRef.current?.requestSubmit();
  };

  return (
    <div
      className={cn(
        { "mt-5": didSendCode, "mb-7": !didSendCode },
        "rounded-md border-2 border-green-300 p-2",
      )}
    >
      <form onSubmit={submitHandler} ref={formRef} className="space-y-3">
        <div className="flex items-end gap-2">
          <LabelInput
            label="email"
            name="newEmail"
            defaultValue={email || ""}
            focus={true}
            onChange={(e) => setDiffEmail(e.target.value !== email)}
            className="w-full"
            error={validError}
          />
          {diffEmail && (
            <Button onClick={sendmail} variant={"success"} disabled={isSending}>
              {didSendCode ? "Resend" : "Send"} Verify Code
            </Button>
          )}
        </div>

        {didSendCode && (
          <div className="flex items-end gap-3">
            <LabelInput
              label="Email change code (until 2 min)"
              type="text"
              name="emailChangeCode"
              error={validError}
              placeholder="input code..."
            />
            <Button
              onClick={confirmAndSave}
              variant={"primary"}
              disabled={isSending}
            >
              Confirm Code & Save
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
