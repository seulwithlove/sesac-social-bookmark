"use client";

import IconLabelButton from "@/components/icon-label-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAlerter } from "@/hooks/contexts/alerter";
import { useStore } from "@/hooks/contexts/store";
import type { MarkAllColumn } from "@/lib/db";
import {
  BookmarkXIcon,
  HatGlassesIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteMark } from "./book.action";

export default function Mark({
  mark,
  bookOwner,
  withdel,
}: {
  mark: MarkAllColumn;
  bookOwner: number;
  withdel: boolean;
}) {
  const { iLikedMarks, iReportedMarks } = useStore();
  const router = useRouter();
  const { alert } = useAlerter();

  const openLinkTrigger = async () => {
    // 좋아요 한 마크는 바로삭제에서 제외!
    if (withdel && mark._count.Likes <= 0) {
      try {
        await deleteMark(mark.id, bookOwner);
        router.refresh();
      } catch (error) {
        console.log(error);
        await alert({ title: (error as Error).message });
      }
    }
  };

  return (
    <div className="group rounded-lg bg-white px-2 pt-2 pb-0.5 shadow-md hover:bg-slate-50 hover:shadow-lg">
      <Link
        href={mark.link}
        onClick={openLinkTrigger}
        target="_blank"
        rel="noopener noreferrer"
        className="mark"
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-16 w-auto max-w-[50%] rounded-lg group-hover:ring-2 group-hover:ring-primary">
            <AvatarImage
              src={mark.image || "/site_dummy.jpg"}
              className="aspect-auto size-auto"
            />
            <AvatarFallback className="w-full">
              {mark.title.substring(0, 8)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden [&>*]:truncate">
            <h1 className="text-lg dark:text-black/70" title={mark.title}>
              {mark.title}
            </h1>
            <small className="text-muted-foreground">
              {mark.descript || mark.title}
            </small>
            <small className="text-muted-foreground underline-offset-2 group-hover:underline">
              {mark.link}
            </small>
          </div>
        </div>
        <Separator className="mt-2 mb-0.5 bg-muted-foreground/30" />
        <div className="flex items-center justify-between text-sm">
          <IconLabelButton
            icon={<ThumbsUpIcon />}
            isActive={iLikedMarks.includes(mark.id)}
          >
            {mark._count.Likes}
          </IconLabelButton>
          <IconLabelButton icon={<MessageCircleIcon />}>
            {mark._count.Talk}
          </IconLabelButton>
          <IconLabelButton
            icon={<HatGlassesIcon />}
            isDanger
            isActive={iReportedMarks.includes(mark.id)}
          >
            {mark._count.Report}
          </IconLabelButton>
          <IconLabelButton
            icon={<BookmarkXIcon className="size-5" />}
            tooltip="Delete this right away"
            isDanger
          />
          <IconLabelButton icon={<MoreHorizontalIcon />} />
        </div>
      </Link>
    </div>
  );
}
