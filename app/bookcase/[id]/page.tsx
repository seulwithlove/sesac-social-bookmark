import { Button } from "@/components/ui/button";
import UserAvater from "@/components/user-avtar";
import { findMemberByIdWithCount } from "@/lib/db";
import { PlusIcon } from "lucide-react";
import { use } from "react";
import Book from "./book";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookcaseNickname({ params }: Props) {
  const { id } = use(params);
  const mbr = use(findMemberByIdWithCount(id));
  if (!mbr) return <h1 className="text-2xl">User Not Found</h1>;

  return (
    <div className="my-2 flex max-h-full flex-col">
      <h1 className="flex items-center justify-between font-semibold text-2xl">
        <div className="flex">
          {/* <UserAvatar id={id} withName={true} /> */}
          {mbr && <UserAvater member={mbr} withName={true} />}
          <span className="ml-2 font-medium text-green-600">Bookcase</span>
        </div>
        <span className="text-lg text-muted-foreground">
          {mbr?._count.Book} Books, {mbr?._count.Mark} Marks, 50 Followers
        </span>
      </h1>

      {/* sm:flex - mobile에서 세로로 볼 경우 추가*/}
      <div className="my-1 flex gap-2 overflow-x-scroll">
        <Book />
        <Book />
        <Book />

        <Button
          variant={"ghost"}
          className="flex w-96 justify-start bg-slate-200 font-semibold text-lg hover:bg-slate-300"
        >
          <PlusIcon /> Add a Book
        </Button>
      </div>
    </div>
  );
}
