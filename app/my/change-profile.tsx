"use client";

import LabelEditor from "@/components/label-editor";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { updateNickname } from "../sign/sign.action";
import EmailChanger from "./email-changer";
import PasswordChanger from "./password-changer";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};

/**
 * 📌 ChangeProfile - 프로필 정보 변경 컴포넌트
 *
 * 기능:
 * 1. 닉네임 변경 (LabelEditor)
 * 2. 이메일 변경 (EmailChanger)
 * 3. 비밀번호 변경 (PasswordChanger)
 *
 * Flow:
 * - 닉네임 변경:
 *   1. LabelEditor에서 값 변경 감지 (isDirty)
 *   2. Save 버튼 클릭 시 changeNickname() 호출
 *   3. updateNickname() 서버 액션 실행
 *   4. update()로 Session 업데이트
 *   5. router.refresh()로 페이지 새로고침
 *
 * - 이메일 변경:
 *   1. "Change email" 버튼 클릭 시 EmailChanger 표시
 *   2. EmailChanger에서 인증 코드 발송 → 확인 → 이메일 변경
 *
 * - 비밀번호 변경:
 *   1. 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 입력
 *   2. Save 버튼 클릭 시 updatePassword() 서버 액션 실행
 *   3. 성공 시 toast 알림 및 폼 초기화
 *
 * @param user - Session user 정보
 */
export default function ChangeProfile({ user }: Props) {
  // 토큰 체크하는 시간필요 : 'revalidate refresh' 옵션 있다면 사용가능
  // const { update } = useSession({ required: true });
  const { update } = useSession();
  const router = useRouter(); //페이지 새로고침 (Session 반영)
  const [isEditingEmail, toggleEditingEmail] = useReducer((pre) => !pre, false);
  const [isEditingPassword, toggleEditingPassword] = useReducer(
    (pre) => !pre,
    true,
  ); // QQQ: false

  /**
   * 닉네임 변경 핸들러
   *
   * Flow:
   * 1. updateNickname() 서버 액션 호출
   * 2. 성공 시 update(mbr)로 Session 업데이트
   * 3. router.refresh()로 auth cookie 반영
   */
  const changeNickname = async (formData: FormData) => {
    const ent = Object.fromEntries(formData.entries());
    console.log("💻 - change-profile.tsx - ent:", ent);

    const [err, mbr] = await updateNickname(formData);
    if (err) return err;
    await update(mbr);
    router.refresh(); // auth의 cookie값 refresh
  };

  return (
    <div className="space-y-3 text-left">
      <LabelEditor
        label="nickname"
        name="nickname"
        defaultValue={user.name || ""}
        saveAction={changeNickname}
      />

      <div className="w-96">
        {isEditingEmail ? (
          <EmailChanger email={user.email} toggleEditing={toggleEditingEmail} />
        ) : (
          <Button
            onClick={toggleEditingEmail}
            variant={"success"}
            className="mt-3 h-12 w-full"
          >
            <PencilIcon /> {user.email}
          </Button>
        )}
      </div>

      <div className="w-96">
        {isEditingPassword ? (
          <PasswordChanger toggleEditing={toggleEditingPassword} />
        ) : (
          <Button
            onClick={toggleEditingPassword}
            variant={"destructive"}
            className="mt-3 h-12 w-full"
          >
            <PencilIcon /> Password
          </Button>
        )}
      </div>
    </div>
  );
}
