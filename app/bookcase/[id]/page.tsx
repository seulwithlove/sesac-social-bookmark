import UserAvater from "@/components/user-avtar";
import { findMemberByIdWithCount } from "@/lib/db";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookcaseNickname({ params }: Props) {
  const { id } = use(params);
  const mbr = use(findMemberByIdWithCount(id));
  if (!mbr) return <h1 className="text-2xl">User Not Found</h1>;

  return (
    <div className="mt-1">
      <h1 className="flex items-center justify-between font-semibold text-3xl">
        <div className="flex">
          {mbr && <UserAvater member={mbr} withName={true} />}
          <span className="ml-2 font-medium text-green-600">Bookcase</span>
        </div>
        <span className="text-lg text-muted-foreground">
          {mbr?._count.Book} Books, {mbr?._count.Mark} Marks, 50 Followers
        </span>
      </h1>
    </div>
  );
}
