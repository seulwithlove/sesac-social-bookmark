import ImageUploader from "@/components/image-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DummyProfile } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
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
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <span>Mark content</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-w[425px]">
              <DialogHeader>
                <DialogTitle>Mark Content</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4">
                <div className="w-50">
                  <ImageUploader src={DummyProfile} alt={"site preview"} />
                </div>
                <div className="flex flex-col">
                  <div className="my-2">
                    <Label htmlFor="url">Site URL</Label>
                    <Input id="url" name="url" defaultValue="bookmark.com" />
                  </div>
                  <div className="my-2">
                    <Label htmlFor="url">Description</Label>
                    <Input id="desc" name="desc" defaultValue="blahblah" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
