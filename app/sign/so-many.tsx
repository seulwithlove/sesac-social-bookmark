import Img from "@/components/ui/img";

type Props = {
  images: { src: string; alt: string }[];
};

export default function SoMany({ images }: Props) {
  return (
    <div className="flex">
      <div className="flex flex-1">
        {/* TODO: use database id */}
        {images.map(({ src: id, src, alt }, idx) => (
          <Img
            key={`${id}`}
            src={src}
            alt={alt}
            width={40}
            height={40}
            className={`translate-x-[${-20 * idx}px] rounded-full border`}
          />
        ))}
      </div>
      <div className="flex flex-1 items-center justify-end border-l-1 pr-2">
        <strong>500K</strong> Books
      </div>
    </div>
  );
}
