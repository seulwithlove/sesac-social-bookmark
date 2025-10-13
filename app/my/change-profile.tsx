"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
 * 3. 비밀번호 변경 (UI만 있음, 구현 미완)
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
 * @param user - Session user 정보
 */
export default function ChangeProfile({ user }: Props) {
  // 토큰 체크하는 시간필요 : 'revalidate refresh' 옵션 있다면 사용가능
  // const { update } = useSession({ required: true });
  const { update } = useSession();
<<<<<<< Updated upstream
  const [diffEmail, setDiffEmail] = useState(false);
=======
  const router = useRouter(); //페이지 새로고침 (Session 반영)
  const [isEditingEmail, toggleEditingEmail] = useReducer((pre) => !pre, true); // QQQ: false

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
    const [err, mbr] = await updateNickname(formData);
    if (err) return err;
    await update(mbr);
    router.refresh(); // auth의 cookie값 refresh
  };
>>>>>>> Stashed changes

  return (
    <form className="space-y-3 text-left">
      <LabelInput
        label="nickname"
        name="nickname"
        focus={true}
        defaultValue={user.name || ""}
      />

      <div className="mb-7 flex items-end gap-2">
        <LabelInput
          label="email"
          name="email"
          defaultValue={user.email || ""}
          onChange={(e) => setDiffEmail(e.target.value !== user.email)}
          className="w-full"
        />
        {diffEmail && <Button variant={"success"}>Send Verify Code</Button>}
      </div>

      <LabelInput
        label="Current Password"
        name="curr_passwd"
        type="password"
        placeholder="current password..."
      />
      <LabelInput
        label="New Password"
        name="passwd"
        type="password"
        placeholder="new password..."
      />
      <LabelInput
        label="New Password Confirm"
        name="passwd2"
        type="password"
        placeholder="new password confirm..."
      />

      <div className="flex justify-center gap-5">
        <Button type="reset" variant={"outline"}>
          <UndoDotIcon /> Cancel
        </Button>
        <Button type="submit" variant={"primary"}>
          <CheckLineIcon /> Save
        </Button>
      </div>
    </form>
  );
}
