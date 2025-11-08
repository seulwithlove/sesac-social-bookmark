"use client";

import ImageUploader from "@/components/image-uploader";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { MarkData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import {
  useActionState,
  useRef,
  useState,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { deleteMarkWithBookId, saveMark } from "./book.action";
import { scrapOgs } from "./og.action";

export default function MarkDialog({
  mark = {
    id: 0,
    book: 0,
    link: "",
    image: "",
    title: "",
    descript: "",
    maker: 0,
  },
  children,
}: PropsWithChildren<{
  mark?: MarkData;
}>) {
  const { confirm, alert } = useAlerter();

  const [isOpen, setOpen] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const desciptRef = useRef<HTMLTextAreaElement>(null);

  const [validError, save, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      console.log("SAVE>>", formData);
      // formData.set('ispublic', ispublic ? 'on' : '');

      formData.set("id", String(mark.id));
      const err = await saveMark(formData);
      console.log("🚀 mark-dialog.err:", err);
      if (err) {
        return err;
      }
    },
    undefined,
  );

  const remove = async () => {
    const ret = await confirm({ title: "Are u sure??" });
    if (!ret) return;

    try {
      await deleteMarkWithBookId(mark.id, bookId);
    } catch {
      if (err) {
        await alert(null, error);
        return;
      }
    }
    setOpen(false);
  };

  const changeImage = (formData: FormData) => {};

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    setOpen(true);
  };

  const scrap = async () => {
    if (!linkRef.current?.value) {
      await alert({
        title: "Input the Link",
      });
      return;
    }
    if (!titleRef.current || !desciptRef.current) return;

    const ogdata = await scrapOgs(linkRef.current.value);
    if (ogdata.ogTitle) titleRef.current.value = ogdata.ogTitle;
    if (ogdata.ogDescription) desciptRef.current.value = ogdata.ogDescription;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger onClick={click} asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mark.id ? "Edit" : "Create"} Book</DialogTitle>
          <DialogDescription>descript...</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-between">
            <ImageUploader
              src={mark.image || `https://avatar.vercel.sh/${mark.title}`}
              alt={mark.title}
              changeImage={changeImage}
            />
          </div>

          <div className="mt-5 space-y-5">
            <form action={save}>
              <InputGroup>
                <InputGroupInput
                  ref={linkRef}
                  defaultValue={mark.link}
                  placeholder="Link(URL)..."
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={scrap} type="button" variant="secondary">
                    Scrap
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <LabelInput
                label="title"
                name="title"
                ref={titleRef}
                error={validError}
                defaultValue={mark.title}
              />

              <div className="flex flex-col">
                <Label htmlFor="descript" className="font-semibold text-sm capitalize">
                  Description
                </Label>
                <Textarea
                  placeholder="description..."
                  id="descript"
                  name="descript"
                  ref={desciptRef}
                  defaultValue={mark.descript ?? ""}
                />
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          {!!mark.id && (
            <Button onClick={remove} type="button" variant={"destructive"}>
              Delete
            </Button>
          )}

          <Button type="submit" disabled={isPending}>
            {mark.id ? "Save" : "Create"} Mark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
