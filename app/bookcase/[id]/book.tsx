import IconLabel from "@/components/icon-label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { findBookWithMarkById, type BookAllColumn } from "@/lib/db";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon, PlusIcon, UserRoundPlusIcon } from "lucide-react";
import { use } from "react";
import Mark from "./mark";

type Props =
  | {
      id: number;
      book?: undefined;
    }
  | { id?: undefined; book: NonNullable<BookAllColumn> };

export default function Book({ id, book }: Props) {
  const data = book ? book : use(findBookWithMarkById(id));
  if (!data)
    return (
      <h1 className="font-semibold text-lg text-muted-foreground">
        Book is not Found!
      </h1>
    );

  const { member, title, remark, ispublic, withdel } = data;
  const session = use(auth());

  const isMine = session?.user.id === String(member);

  return (
    <div className="flex w-80 flex-shirink-0 flex-col justify-start rounded-lg border-2 border-red-300 bg-slate-200 pl-2">
      <div className="flex items-center justify-between">
        <h1
          className={cn(
            "truncate font-medium text-xl tracking-tighter",
            ispublic
              ? "text-green-500 text-shadow-green-300"
              : "text-muted-foreground text-shadow-gray-300",
          )}
        >
          {title}
        </h1>

        {isMine ? (
          <Button
            variant={"ghost"}
            className="font-semibold text-lg hover:bg-slate-300"
          >
            <MoreHorizontalIcon />
          </Button>
        ) : (
          (ispublic ?? (
            <Button
              variant={"ghost"}
              className="font-semibold text-lg hover:bg-slate-300"
            >
              <IconLabel
                icon={<UserRoundPlusIcon className="text-green-500" />}
                noti={"success"}
              >
                30
              </IconLabel>
            </Button>
          ))
        )}
      </div>

      <div className="max-h-full space-y-2 overflow-y-scroll rounded-lg pr-2 pb-3">
        <Mark />
        <Mark />
      </div>

      <div className="my-1 flex justify-between font-medium">
        <Button
          variant={"ghost"}
          className="flex w-[80%] justify-start font-semibold text-lg hover:bg-slate-300"
        >
          <PlusIcon /> Add a Mark
        </Button>

        <Badge
          variant={"outline"}
          className="ml-2 h-5 min-w-5 rounded-full bg-slate-50 px-1"
        >
          8
        </Badge>
      </div>
    </div>
  );
}
