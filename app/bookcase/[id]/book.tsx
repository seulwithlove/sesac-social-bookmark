import IconLabel from "@/components/icon-label";
import ToolTip from "@/components/tool-tip";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { findBookWithMarkById, type BookAllColumn } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  AlbumIcon,
  BookKeyIcon,
  CopyXIcon,
  HeartPlusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { use } from "react";
import BookDialog from "./book-dialog";
import Mark from "./mark";

type Props =
  | { id: number; book?: undefined }
  | { id?: undefined; book: NonNullable<BookAllColumn> };

export default function Book({ id, book }: Props) {
  const data = book ? book : use(findBookWithMarkById(id));
  if (!data)
    return (
      <h1 className="font-semibold text-lg text-muted-foreground">
        Book is not Found!
      </h1>
    );

  const { title, remark, ispublic, withdel, member } = data;
  const session = use(auth());
  const isMine = session?.user.id === String(member);

  const totalLikesCnt = book?.Mark.reduce(
    (acc, mark) => acc + mark._count.Likes,
    0,
  );

  return (
    <div className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg bg-slate-200 pl-2 dark:bg-muted">
      <div className="flex items-center justify-between pr-2">
        <h1
          className={cn(
            "flex items-center truncate p-2 font-semibold text-xl tracking-tighter",
            ispublic
              ? "text-green-500 text-shadow-green-300"
              : "text-muted-foreground text-shadow-gray-300",
          )}
          title={remark || title}
        >
          {!ispublic && <BookKeyIcon />} {title}
        </h1>

        {isMine ? (
          <BookDialog book={data}>
            <Button
              variant={"ghost"}
              className="font-semibold text-lg hover:bg-slate-300"
            >
              <MoreHorizontalIcon />
            </Button>
          </BookDialog>
        ) : (
          ispublic && (
            <Button
              variant={"ghost"}
              className="font-semibold text-lg hover:bg-slate-300"
            >
              <IconLabel
                icon={<UserRoundPlusIcon className="text-green-500" />}
                noti={"success"}
              >
                <small>28</small>
              </IconLabel>
            </Button>
          )
        )}
      </div>

      {/* mark group */}
      <div className="max-h-fullxx space-y-2 overflow-y-scroll pr-2 pb-3">
        {book?.Mark.length ? (
          book?.Mark.map((mark) => (
            <Mark
              key={mark.id}
              mark={mark}
              bookOwner={book.member}
              withdel={book.withdel}
            />
          ))
        ) : (
          <h1 className="rounded-lg bg-white p-5 font-medium text-muted-foreground text-xl">
            There is no Marks.
          </h1>
        )}
      </div>
      {isMine && (
        <div className="my-1 flex items-center justify-between pr-2 font-medium">
          <Button
            variant={"ghost"}
            className="flex rounded-full font-semibold text-lg hover:bg-muted-foreground/30 dark:hover:bg-muted-foreground/30"
          >
            <PlusIcon /> Add a Mark
          </Button>

          <div className="flex gap-2">
            <IconLabel icon={<AlbumIcon />}>{book?.Mark.length}</IconLabel>

            {ispublic && (
              <IconLabel icon={<HeartPlusIcon className="text-red-400" />}>
                {totalLikesCnt}
              </IconLabel>
            )}

            {withdel && (
              <ToolTip content={"With Del"} variant="destructive">
                <CopyXIcon className="text-red-500" />
              </ToolTip>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
