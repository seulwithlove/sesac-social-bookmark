"use client";

import type prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
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
  changeImage?: (
    formData: FormData,
  ) => Promise<[ValidError, typeof prisma.member]>;
};

export default function ImageUploader({ src, alt, changeImage }: Props) {
  const { update } = useSession();

  const [isDragging, setDragging] = useState(false);
  const [img, setImg] = useState(src);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setPreview(e.target.files[0]);
  };

  const setPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setImg(e.target.result as string);

      // set dragged img file to input
      if (fileRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileRef.current.files = dataTransfer.files;
      }
      formRef.current?.requestSubmit();
    };
    reader.readAsDataURL(file);
  };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);

      // 디버깅을 위한 로그
      console.log("💻 FormData image:", formData.get("image"));

      if (!changeImage) return;

      const [error, mbr] = await changeImage(formData);
      console.log("💻 - image-uploader.tsx - mbr:", mbr);
      console.log("💻 - image-uploader.tsx - error:", error);

      if (error) {
        // ValidError 객체를 읽기 쉬운 메시지로 변환
        const errorMessages = Object.values(error)
          .flatMap((field) => field.errors)
          .join("\n");
        return alert(errorMessages || "업로드 중 오류가 발생했습니다.");
      }

      if (mbr) {
        await update(mbr);
      }
    });
  };

  return (
    <form onSubmit={submitHandler} ref={formRef} className="w-full">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: file attatch */}
      <div
        onDragOver={(e) => {
          e.preventDefault(); // file drag&drop -> 파일 전체화면으로 출력되는 현상 방지
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
        }}
        className={cn(
          "relative aspect-square w-full cursor-pointer rounded-full border-2 shadow-md",
          { "border-blue-500 border-dotted": isDragging },
        )}
      >
        <Image
          src={img}
          alt={alt || ""}
          onClick={() => fileRef.current?.click()}
          className="rounded-full border"
          fill
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
    </form>
  );
}
