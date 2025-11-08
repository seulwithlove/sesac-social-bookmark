import ImageUploader from "@/components/image-uploader";
import SignOutButton from "@/components/signout-button";
import { auth } from "@/lib/auth";
import DummyProfile from "@/public/profile-dummy.png";
import { redirect } from "next/navigation";
import { use } from "react";
import { updateProfileImage } from "../sign/sign.action";
import ChangeProfile from "./change-profile";
import WithdrawButton from "./withdraw-button";

export default function My() {
  const session = use(auth());
  // console.log('🚀 my.session:', session);
  if (!session?.user?.name) redirect("/sign");

  // const updateInfo = async () => {
  //   update(user);
  // };

  const { name, image } = session.user;
  return (
    <div className="container mx-auto grid h-full max-w-[700px] place-items-center">
      <div className="w-full rounded-md border p-5 text-center shadow-sm">
        <h1 className="mb-5 font-semibold text-2xl">My Page</h1>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-between">
            <ImageUploader
              src={image || DummyProfile}
              alt={name}
              changeImage={updateProfileImage}
            />
          </div>

          <div className="col-span-2 border p-3">
            <ChangeProfile user={session.user} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <SignOutButton name={name} />
          <div className="col-span-2 text-right">
            <WithdrawButton />
          </div>
        </div>
      </div>
    </div>
  );
}
