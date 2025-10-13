"use client";

import LabelEditor from "@/components/label-editor";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
import { toast } from "sonner";
import { updateNickname, updatePassword } from "../sign/sign.action";
import EmailChanger from "./email-changer";

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
  const [isEditingEmail, toggleEditingEmail] = useReducer((pre) => !pre, true); // QQQ: false
  const [validError, setValidError] = useState<ValidError | null>(null);
  const [isPending, setIsPending] = useState(false);

  /**
   * 닉네임 변경 핸들러
   *
   * Flow:
   * 1. updateNickname() 서버 액션 호출
   * 2. 성공 시 update(mbr)로 Session 업데이트
   * 3. router.refresh()로 auth cookie 반영
   */
  const changeNickname = async (formData: FormData) => {
    const [err, mbr] = await updateNickname(formData);
    if (err) return err;
    await update(mbr);
    router.refresh(); // auth의 cookie값 refresh
  };

  /**
   * 비밀번호 변경 폼 제출 핸들러
   */
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 폼 요소를 미리 저장 (비동기 작업 후 e.currentTarget이 null이 되는 것 방지)
    const form = e.currentTarget;

    setIsPending(true);
    setValidError(null);

    const formData = new FormData(form);
    const result = await updatePassword(formData);

    setIsPending(false);

    if (!result) {
      toast.success("Password changed successfully!");
      form.reset(); // 폼 초기화
    } else {
      setValidError(result);
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="space-y-6 text-left">
      <LabelEditor
        label="nickname"
        name="nickname"
        defaultValue={user.name || ""}
        saveAction={changeNickname}
      />

      {isEditingEmail ? (
        <EmailChanger email={user.email} toggleEditing={toggleEditingEmail} />
      ) : (
        <Button
          onClick={toggleEditingEmail}
          variant={"success"}
          className="mt-3"
        >
          Change {user.email}
        </Button>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-3 border-t pt-6">
        <h3 className="mb-4 font-semibold text-lg">Change Password</h3>

        <LabelInput
          label="Current Password"
          name="curr_passwd"
          type="password"
          placeholder="current password..."
          error={validError || undefined}
        />
        <LabelInput
          label="New Password"
          name="passwd"
          type="password"
          placeholder="new password..."
          error={validError || undefined}
        />
        <LabelInput
          label="New Password Confirm"
          name="passwd2"
          type="password"
          placeholder="new password confirm..."
          error={validError || undefined}
        />

        <div className="flex justify-center gap-5">
          <Button type="reset" variant={"outline"}>
            <UndoDotIcon /> Cancel
          </Button>
          <Button type="submit" variant={"primary"} disabled={isPending}>
            <CheckLineIcon /> {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
