"use client";

import IconLabelButton from "@/components/icon-label-button";
import { useAlerter } from "@/hooks/contexts/alerter";
import { HeartPlusIcon } from "lucide-react";
import { useTransition, type PropsWithChildren } from "react";
import { toggleFollowBook } from "./book.action";

type Props = {
  bookId: number;
  bookOwner: number;
  isActive: boolean;
};
export default function FollowButton({
  bookId,
  bookOwner,
  isActive,
  children,
}: PropsWithChildren<Props>) {
  const { alert } = useAlerter();
  const [isPending, startTransition] = useTransition();

  const toggleFollow = () => {
    startTransition(async () => {
      try {
        await toggleFollowBook(bookId, bookOwner);
      } catch (error) {
        alert(null, error);
      }
    });
  };

  return (
    <IconLabelButton
      onClick={toggleFollow}
      icon={<HeartPlusIcon className="size-6 text-green-600" />}
      noti={"success"}
      isActive={isActive}
      disabled={isPending}
    >
      {children}
    </IconLabelButton>
  );
}
