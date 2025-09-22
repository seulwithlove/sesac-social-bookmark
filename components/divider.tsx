export default function Divider({ label }: { label: string }) {
  return (
    <div className='relative text-center text-gray-600 before:absolute before:top-[50%] before:left-0 before:h-[1px] before:w-[45%] before:bg-gray-200 before:content-[""] after:absolute after:top-[50%] after:right-0 after:h-[1px] after:w-[45%] after:bg-gray-200 after:content-[""]'>
      {label}
    </div>
  );
}
