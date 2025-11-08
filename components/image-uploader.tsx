"use client";
import type { UpdateProfileImageReturn } from "@/app/sign/sign.action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type ForwardedRef,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from "react";
import Img from "./ui/img";

export type ImageUploaderHandler = {
  setSrc: (src: string | Blob | undefined) => void;
  getSrc: () => string | Blob | undefined;
};

type Props = {
  // src: string | StaticImageData;
  src: string | Blob | undefined;
  alt?: string;
  // changeImage?: (formData: FormData) => UpdateProfileImageReturn;
  changeImage?: (formData: FormData) => unknown;
  isNotProfile?: boolean;
  ref: ForwardedRef<ImageUploaderHandler>;
};

export default function ImageUploader({
  src,
  alt,
  changeImage,
  isNotProfile,
  ref,
}: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [isDragging, setDragging] = useState(false);
  const [img, setImg] = useState(src);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const handler: ImageUploaderHandler = {
    setSrc: (src: string | Blob | undefined) => setImg(src),
    getSrc: () => img,
    // setSrc: setImg,
  };
  useImperativeHandle(ref, () => handler);

  const setImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setPreview(e.target.files[0], true);
  };

  const setPreview = (file: File, needSubmit = false) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log('🚀 ~ e:', e.target?.result);
      if (e.target) setImg(e.target.result as string);
      if (needSubmit) formRef.current?.requestSubmit();
    };
    reader.readAsDataURL(file);
  };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // console.log('****>>', formData.get('image'));
    uploadImage(formData);
  };

  const uploadImage = (formData: FormData) => {
    setErrorMsgs([]);
    startTransition(async () => {
      // const ent = Object.fromEntries(formData.entries());
      // console.log('🚀 ~ ent:', ent);
      if (!changeImage) return;

      if (isNotProfile) {
        changeImage(formData);
      } else {
        const [err, mbr] = (await changeImage(
          formData,
        )) as Awaited<UpdateProfileImageReturn>;

        if (err) {
          console.log("ERROR>>", err, typeof err.image);
          setImg(src);
          if (typeof err.image === "object" && err.image?.errors)
            setErrorMsgs(err.image.errors);
          return;
        }

        await update(mbr);
      }
      router.refresh();
    });
  };

  const dummyImage = `https://avatar.vercel.sh/${alt || ""}`;

  return (
    <form onSubmit={submitHandler} ref={formRef} className="w-full">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: file attach */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const files = e.dataTransfer.files;
          if (files?.length) setPreview(files[0]);

          const formData = new FormData();
          formData.append("image", files[0]);
          uploadImage(formData);
        }}
        className={cn(
          "relative aspect-square w-full cursor-pointer rounded-full border-2 shadow-sm",
          { "border-blue-500 border-dotted": isDragging },
        )}
      >
        <Img
          src={img}
          alt={alt || ""}
          onClick={() => fileRef.current?.click()}
          className="h-full w-full rounded-full border object-cover"
          onError={() => setImg(dummyImage)}
        />

        <input
          type="file"
          name="image"
          ref={fileRef}
          accept="image/*"
          onChange={setImageFile}
          disabled={isPending}
          hidden
        />
      </div>
      <div className="">
        {errorMsgs.map((emsg) => (
          <p key={emsg} className="text-red-500">
            {emsg}
          </p>
        ))}
      </div>
    </form>
  );
}
