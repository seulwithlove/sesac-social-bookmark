"use client";

import ImageUploader, { type ImageUploaderHandler } from "@/components/image-uploader";
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
import { ZapIcon } from "lucide-react";
import {
  useActionState,
  useRef,
  useState,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { deleteMarkWithBookId, saveMark } from "./book.action";
import { scrapOg } from "./og.action";

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
  const descriptRef = useRef<HTMLTextAreaElement>(null);
  const imgUpRef = useRef<ImageUploaderHandler>(null);

  const [validError, save, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      console.log("SAVE>>", Object.fromEntries(formData.entries()));
      // formData.set('ispublic', ispublic ? 'on' : '');

      formData.set("id", String(mark.id));
      formData.set("book", String(mark.book));
      const img = imgUpRef.current?.getSrc();
      if (img) formData.set("image", img);

      const err = await saveMark(formData);
      console.log("🚀 mark-dialog.err:", err);
      if (err) {
        return err;
      }

      setOpen(false);
    },
    undefined,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const callSave = () => {
    formRef.current?.requestSubmit();
  };

  const remove = async () => {
    const ret = await confirm({ title: "Are u sure??" });
    console.log("🚀 remove ** ret:", ret);
    if (!ret) return;

    try {
      await deleteMarkWithBookId(mark.id, mark.book);
    } catch (err) {
      await alert(null, err);
      setOpen(false);
      return;
    }
    setOpen(false);
  };

  const changeImage = (formData: FormData) => {
    console.log("🚀 ~ formData:", formData);
  };

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("eeeeeeeee>>", e);
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const scrap = async () => {
    console.log("scrap>>>", linkRef.current?.value);
    if (!linkRef.current?.value) {
      await alert({ title: "Input the Link!" });
      return;
    }

    if (!titleRef.current || !descriptRef.current || !imgUpRef.current) return;

    const { ogTitle, ogDescription, ogImage, favicon } = await scrapOg(
      linkRef.current.value,
    );

    if (ogTitle) titleRef.current.value = ogTitle;
    if (ogDescription) descriptRef.current.value = ogDescription;
    if (ogImage?.length || favicon) imgUpRef.current.setSrc(ogImage?.[0]?.url || favicon);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger onClick={click} asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mark.id ? "Edit" : "Create"} Mark</DialogTitle>
          <DialogDescription>{mark.link}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-between">
            <ImageUploader
              src={mark.image || `https://avatar.vercel.sh/${mark.title}`}
              alt={mark.title}
              changeImage={changeImage}
              ref={imgUpRef}
            />
          </div>

          <div className="col-span-2 border p-3">
            <form ref={formRef} action={save}>
              <div className="mt-5 space-y-5">
                <InputGroup>
                  <InputGroupInput
                    name={"link"}
                    ref={linkRef}
                    defaultValue={mark.link}
                    placeholder="Link(URL)..."
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={scrap} type="button" variant="success">
                      <ZapIcon />
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
                    ref={descriptRef}
                    defaultValue={mark.descript ?? ""}
                  />
                </div>
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

          <Button onClick={callSave} disabled={isPending}>
            {mark.id ? "Save" : "Create"} Mark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
