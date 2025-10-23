"use client";

import CheckSwitch from "@/components/check-switch";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BookData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { useRouter } from "next/navigation";
import { useActionState, type PropsWithChildren } from "react";
import { deleteBook, saveBook } from "./book.action";

export default function BookDialog({
  book = {
    id: 0,
    title: "",
    ispublic: true,
    withdel: false,
    remark: "",
    member: 0,
  },
  children,
}: PropsWithChildren<{
  book?: BookData;
}>) {
  const router = useRouter();
  // const [ispublic, setPublic] = useState(false);
  // const [withdel, setWithDel] = useState(false);

  const [validError, save, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      // formData.set("ispublic", ispublic ? "on" : "");
      const err = await saveBook(formData);
      console.log("💻 - book-dialog.tsx - err:", err);

      if (err) {
        return err;
      }

      router.refresh();
    },
    undefined,
  );

  const remove = async () => {
    await deleteBook(book.id);
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form action={save}>
          <DialogHeader>
            <DialogTitle>{book.id ? "Create" : "Edit"} Book</DialogTitle>
            <DialogDescription>Descriptions...</DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-5">
            <LabelInput
              label="title"
              name="title"
              error={validError}
              defaultValue={book.title}
            />

            {/* <div className="flex items-center gap-3">
              <Checkbox
                id="ispublic"
                name="ispublic"
                checked={book.ispublic}
                onCheckedChange={(checked) => setPublic(!!checked)}
              />
              <Label htmlFor="ispublic" className="cursor-pointer">
                Public {book.ispublic && "XX"}
              </Label>
            </div> */}
            <CheckSwitch
              name="ispublic"
              label="Public Book"
              error={validError}
            />

            <CheckSwitch
              name="withDel"
              label="Open with deletion"
              type="switch"
              error={validError}
            />

            {/* <div>
              <div className="flex items-center gap-3">
                <Switch
                  id="withdel"
                  name="withdel"
                  checked={book.withdel}
                  onCheckedChange={(checked) => setWithDel(!!checked)}
                />
                <Label htmlFor="withdel">
                  Open with deletion: {!!validError?.withdel?.value && "xx"}
                </Label>
              </div>
              <p className="mt-1 text-red-400 text-sm">
                {validError?.withdel?.errors[0]}
              </p>
            </div> */}

            <div className="flex flex-col">
              <Label
                htmlFor="remark"
                className="font-semibold text-sm capitalize"
              >
                Description
              </Label>
              <Textarea
                placeholder="Description..."
                id="remark"
                name="remark"
                defaultValue={book.remark ?? ""}
              />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>

            {!!book.id && (
              <Button onClick={remove} type="button" variant={"destructive"}>
                Delete
              </Button>
            )}

            <Button type="submit" disabled={isPending}>
              {book.id ? "Save" : "Create"} Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
