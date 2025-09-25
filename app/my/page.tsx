import ImageUploader from "@/components/image-uploader";
import SignOutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import DummyProfile from "@/public/profile-dummy.png";
import { BadgeX } from "lucide-react";
import { redirect } from "next/navigation";
import { use } from "react";
import { updateProfileImage } from "../sign/sign.action";
import ChangeProfile from "./change-profile";

export default function My() {
  const session = use(auth());
  if (!session?.user?.name) redirect("/sign");

  // const updateInfo = async (formData:FormData) => {
  //   update(user);
  // };

  const { name, image } = session.user;
  return (
    <div className="grid h-full place-items-center">
      <div className="w-full rounded-md border p-5 text-center shadow-sm">
        <h1 className="mb-5 font-semibold text-3xl">My Page</h1>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-between">
            <ImageUploader
              src={image || DummyProfile}
              alt={name}
              changeImage={updateProfileImage}
            />

            <div>
              <SignOutButton name={name} />
              <Button variant={"destructive"} className="mt-3 w-full">
                <BadgeX />
                Withdraw BookMark
              </Button>
            </div>
          </div>

          <div className="col-span-2 border">
            <ChangeProfile user={session.user} />
          </div>
        </div>
      </div>
    </div>
  );
}
