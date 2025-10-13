import ImageUploader from "@/components/image-uploader";
import SignOutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { DummyProfile } from "@/lib/utils";
import { BadgeXIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { use } from "react";
import { updateProfileImage } from "../sign/sign.action";
import ChangeProfile from "./change-profile";

/**
 * 📌 My Page - 마이 페이지 (프로필 관리)
 *
 * 기능:
 * 1. 프로필 이미지 변경 (ImageUploader)
 * 2. 닉네임 변경 (ChangeProfile)
 * 3. 이메일 변경 (ChangeProfile > EmailChanger)
 * 4. 비밀번호 변경 (ChangeProfile - UI만 있음, 구현 미완)
 * 5. 로그아웃 (SignOutButton)
 * 6. 회원 탈퇴 (UI만 있음, 구현 미완)
 *
 * Flow:
 * 1. auth()로 Session 확인 → 로그인 안 되어 있으면 /sign으로 리다이렉트
 * 2. Session에서 사용자 정보 추출 (name, image)
 * 3. ChangeProfile 컴포넌트로 session.user 전달
 *
 * Protected Route: 로그인 필수
 */
export default function My() {
  const session = use(auth());
  if (!session?.user?.name) redirect("/sign");

  // const updateInfo = async () => {
  //   update(user);
  // };

  const { name, image } = session.user;
  return (
    <div className="grid h-full place-items-center">
      <div className="w-full rounded-md border p-5 text-center shadow-sm">
        <h1 className="mb-5 font-semibold text-2xl">My Page</h1>
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
                <BadgeXIcon /> Widthraw BookMark
              </Button>
            </div>
          </div>

          <div className="col-span-2 border p-3">
            <ChangeProfile user={session.user} />
          </div>
        </div>
      </div>
    </div>
  );
}
