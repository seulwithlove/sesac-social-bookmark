"use client";

import ImageUploader from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DummyProfile } from "@/lib/utils";

export default function Mark() {
  return (
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
  );
}
