"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};
export default function ChangeProfile({ user }: Props) {
  const { update } = useSession({ required: true });
  const [diffEmail, setDiffEmail] = useState(false);

  return (
    <form className="space-y-3 text-left">
      <LabelInput
        label="nickname"
        name="nickname"
        focus={true}
        defaultValue={user.name || ""}
      />

      <div className="mb-7 flex items-end gap-2">
        <LabelInput
          label="email"
          name="email"
          defaultValue={user.email || ""}
          onChange={(e) => setDiffEmail(e.target.value !== user.email)}
          className="w-full"
        />
        {diffEmail && <Button variant={"success"}>Send Verify Code</Button>}
      </div>

      <LabelInput
        label="Current Password"
        name="curr_passwd"
        type="password"
        placeholder="current password..."
      />
      <LabelInput
        label="New Password"
        name="passwd"
        type="password"
        placeholder="new password..."
      />
      <LabelInput
        label="New Password Confirm"
        name="passwd2"
        type="password"
        placeholder="new password confirm..."
      />

      <div className="flex justify-center gap-5">
        <Button type="reset" variant={"outline"}>
          <UndoDotIcon /> Cancel
        </Button>
        <Button type="submit" variant={"primary"}>
          <CheckLineIcon /> Save
        </Button>
      </div>
    </form>
  );
}
