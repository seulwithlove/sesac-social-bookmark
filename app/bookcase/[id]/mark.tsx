"use client";

import IconLabelButton from "@/components/icon-label-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { MarkAllColumn } from "@/lib/db";
import {
  BookmarkXIcon,
  HatGlassesIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ThumbsUpIcon,
} from "lucide-react";

export default function Mark({ mark }: { mark: MarkAllColumn }) {
  return (
    <div className="group rounded-lg bg-white px-2 pt-2 pb-0.5 shadow-md hover:bg-slate-50 hover:shadow-lg">
      <div className="flex items-center gap-2">
        <Avatar className="size-auto h-16 max-w-[50%] rounded-lg group-hover:ring-2 group-hover:ring-primary">
          <AvatarImage src={mark.image || "/site_dummy.jpg"} />
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
        <IconLabelButton icon={<ThumbsUpIcon />}>
          {mark._count.Likes}
        </IconLabelButton>
        <IconLabelButton icon={<MessageCircleIcon />}>
          {mark._count.Talk}
        </IconLabelButton>
        <IconLabelButton icon={<HatGlassesIcon />} isDanger>
          {mark._count.Report}
        </IconLabelButton>
        <IconLabelButton
          icon={<BookmarkXIcon className="size-5" />}
          tooltip="Delete this right away"
          isDanger
        />
        <IconLabelButton icon={<MoreHorizontalIcon />} />
      </div>
    </div>
  );
}
