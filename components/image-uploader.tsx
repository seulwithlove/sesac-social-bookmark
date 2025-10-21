"use client";

import type { UpdateProfileImageReturn } from "@/app/sign/sign.action";
import { cn, DummyProfile } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";

type Props = {
  src: string | StaticImageData;
  alt?: string;
  changeImage?: (formData: FormData) => UpdateProfileImageReturn;
};

export default function ImageUploader({ src, alt, changeImage }: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [isDragging, setDragging] = useState(false);
  const [img, setImg] = useState(src);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

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

    uploadImage(formData);
  };

  const uploadImage = (formData: FormData) => {
    setErrorMsgs([]);
    startTransition(async () => {
      // const ent = Object.fromEntries(formData.entries());
      // console.log("💻 - image-uploader.tsx - ent:", ent);

      if (!changeImage) return;
      const [err, mbr] = await changeImage(formData);
      if (err) {
        // return console.log("Error>>", err);
        setImg(src);
        if (typeof err.image === "object" && err.image?.errors.length)
          setErrorMsgs(err.image.errors);
        return;
      }
      await update(mbr);
      router.refresh(); // 이미지가 같이 바뀌어야하기때문에 : 꼭 필요할때만 사용!
    });
  };

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
        <Image
          src={img}
          alt={alt || ""}
          onClick={() => fileRef.current?.click()}
          className="rounded-full border"
          fill
          unoptimized={process.env.NODE_ENV === "development"}
          onError={() => setImg(DummyProfile)}
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
      <div>
        {errorMsgs.map((emsg) => (
          <p key={emsg} className="text-red-500">
            {emsg}
          </p>
        ))}
      </div>
    </form>
  );
}
