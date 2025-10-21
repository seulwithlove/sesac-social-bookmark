import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartHandshake, MoreHorizontalIcon, PlusIcon } from "lucide-react";

export default function Book() {
  return (
    <div className="flex w-96 flex-col justify-start rounded-lg border-2 border-red-300 bg-slate-200 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="my-2 font-medium text-xl">Book Title</h1>
          <Badge
            className="ml-2 h-5 min-w-5 rounded-full bg-slate-50 px-1 font-mono tabular-nums"
            variant={"outline"}
          >
            8
          </Badge>
        </div>
        <Button
          variant={"ghost"}
          className="font-medium text-lg hover:bg-slate-300"
        >
          <HeartHandshake />
        </Button>
      </div>
      <div className="space-y-2 overflow-y-scroll rounded-md bg-sky-300 p-3">
        <div className="bg-white text-9xl">Marks</div>
        <div className="bg-white text-9xl">Marks</div>
        <div className="bg-white text-9xl">Marks</div>
        <div className="bg-white text-9xl">Marks</div>
        <div className="bg-white text-9xl">Marks</div>
        <div className="bg-white text-9xl">Marks</div>
      </div>
      <div className="my-1 flex justify-between font-medium">
        <Button
          variant={"ghost"}
          className="flex w-[80%] justify-start font-semibold text-lg hover:bg-slate-300"
        >
          <PlusIcon /> Add a Mark
        </Button>

        <Button
          variant={"ghost"}
          className="font-medium text-lg hover:bg-slate-300"
        >
          <MoreHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}
