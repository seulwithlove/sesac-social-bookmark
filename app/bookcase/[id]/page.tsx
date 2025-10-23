import IconLabel from "@/components/icon-label";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avtar";
import { auth } from "@/lib/auth";
import prisma, { findMemberByIdWithCount } from "@/lib/db";
import {
  AlbumIcon,
  BookMarkedIcon,
  PlusIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { use } from "react";
import Book from "./book";
import BookDialog from "./book-dialog";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookcaseNickname({ params }: Props) {
  const session = use(auth());
  const isMyBookcase = !!session?.user;
  const { id } = use(params);

  const mbr = use(findMemberByIdWithCount(id));
  if (!mbr) return <h1 className="text-2xl">User Not Found</h1>;

  const books = use(
    prisma.book.findMany({
      where: { member: Number(id) },
      include: { Mark: true },
    }),
  );
  return (
    <div className="flex max-h-full flex-col pt-2">
      <h1 className="flex items-center justify-between px-5 font-semibold text-2xl">
        <div className="flex items-center tracking-wider">
          {/* <UserAvatar id={id} withName={true} /> */}
          {mbr && <UserAvatar member={mbr} withName={true} />}
          <span className="ml-2 font-medium text-green-600 tracking-tighter">
            Bookcase
          </span>
        </div>
        <span className="flex gap-3 text-lg">
          <IconLabel icon={<BookMarkedIcon />}>{mbr._count.Book}</IconLabel>
          <IconLabel icon={<AlbumIcon />} noti="primary">
            {mbr._count.Mark}
          </IconLabel>
          <IconLabel icon={<UserRoundPlusIcon />} noti="destructive">
            50
          </IconLabel>
        </span>
      </h1>

      <div className="flex gap-3 overflow-x-scroll py-2">
        {books.map((book) => (
          <Book key={book.id} book={book} />
        ))}
        {isMyBookcase && (
          <BookDialog>
            <Button
              variant={"ghost"}
              className="flex w-72 justify-start rounded-full bg-slate-200 font-semibold text-lg hover:bg-slate-300"
            >
              <PlusIcon /> Add a Book
            </Button>
          </BookDialog>
        )}
      </div>
    </div>
  );
}
