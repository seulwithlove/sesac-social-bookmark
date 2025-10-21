import { findMemberByIdWithCount, type MemberWithCount } from "@/lib/db";

import { DummyProfileFile } from "@/lib/utils";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props =
  | {
      id: number | string;
      member?: undefined;
      withName?: boolean;
    }
  | {
      id?: undefined;
      member: NonNullable<MemberWithCount>;
      withName?: boolean;
    };

export default function UserAvater({ id, member, withName }: Props) {
  const mbr = member ? member : use(findMemberByIdWithCount(id));

  if (!mbr)
    return (
      <Avatar>
        <AvatarImage src={"/profile-dummy.png"}></AvatarImage>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );

  return (
    <div className="flex items-center gap-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar>
            <AvatarImage src={mbr.image || DummyProfileFile}></AvatarImage>
            <AvatarFallback>{mbr.nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-60 max-w-80">
          <div className="flex justify-between gap-1">
            <div className="w-20">
              <Avatar className="h-16 w-16">
                <AvatarImage className="" src={mbr.image || DummyProfileFile} />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">@{mbr.nickname}</h4>
              <p className="text-muted-foreground text-sm">{mbr.email}</p>
              <div className="text-muted-foreground text-xs">
                {mbr._count.Book} Books
                {mbr._count.Mark} Marks 00 Followers
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      {withName && decodeURI(mbr.nickname)}
    </div>
  );
}
