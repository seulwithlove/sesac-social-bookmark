"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  type ActionDispatch,
  type FormEvent,
  type MouseEvent,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import { flushSync } from "react-dom";
import { sendEmailChangeCode, updateEmail } from "../sign/sign.action";

type Props = {
  email: string | null | undefined;
  toggleEditing: ActionDispatch<[]>;
};

/**
 * 📌 EmailChanger - 이메일 변경 컴포넌트
 *
 * 2단계 프로세스:
 * 1. 새 이메일 입력 → "Send Verify Code" 버튼 클릭
 *    - sendEmailChangeCode() 호출
 *    - 새 이메일로 5자리 인증 코드 발송
 *    - DB에 emailcheck 저장 (2분 후 자동 삭제)
 *
 * 2. 인증 코드 입력 → "Confirm Code & Save" 버튼 클릭
 *    - updateEmail() 호출
 *    - 인증 코드 검증
 *    - DB에서 이메일 변경
 *    - Session 업데이트
 *
 * 상태 관리:
 * - diffEmail: 이메일이 변경되었는지 여부
 * - didSendCode: 인증 코드를 발송했는지 여부
 * - submitType: "sendmail" | "confirm" (어떤 액션인지)
 *
 * @param email - 현재 이메일
 * @param toggleEditing - 이메일 변경 UI 닫기 함수
 */
export default function EmailChanger({ email, toggleEditing }: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [diffEmail, setDiffEmail] = useState(false);
  const [didSendCode, toggleSendCode] = useReducer((pre) => !pre, false);
  const [validError, setValidError] = useState<ValidError>();

  const formRef = useRef<HTMLFormElement>(null);
  const [submitType, setSubmitType] = useState<"sendmail" | "confirm">(
    "sendmail",
  );

  // 로딩 상태 - useTransition으로 비동기 처리
  const [isSending, startTransition] = useTransition();

  /**
   * 폼 제출 핸들러
   *
   * submitType에 따라 다른 액션 실행:
   * - "sendmail": sendEmailChangeCode() → 새 이메일로 인증 코드 발송
   * - "confirm": updateEmail() → 인증 코드 확인 후 이메일 변경
   */
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    console.log("email changer : ##############", submitType);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("*", Object.fromEntries(formData.entries()));
    startTransition(async () => {
      if (submitType === "sendmail") {
        const err = await sendEmailChangeCode(formData);
        if (err) setValidError(err);
        else toggleSendCode();
      } else if (submitType === "confirm") {
        const [err, mbr] = await updateEmail(formData);

        if (err) {
          setValidError(err);
        } else {
          await update(mbr);
          router.refresh();
        }
      }
    });
  };

  /**
   * "Send Verify Code" 버튼 클릭 핸들러
   * - submitType을 "sendmail"로 설정
   * - formRef.requestSubmit()으로 폼 제출 트리거
   */
  const sendmail = (e: MouseEvent) => {
    e.preventDefault();
    setSubmitType(() => "sendmail");
    formRef.current?.requestSubmit();
  };

  /**
   * "Confirm Code & Save" 버튼 클릭 핸들러
   * - flushSync로 submitType을 "confirm"으로 설정 (동기 처리)
   * - formRef.requestSubmit()으로 폼 제출 트리거
   */
  const confirmAndSave = (e: MouseEvent) => {
    e.preventDefault();
    flushSync(() => setSubmitType("confirm"));
    formRef.current?.requestSubmit();
  };

  return (
    <div
      className={cn(
        { "mt-5": didSendCode, "mb-7": !didSendCode },
        "rounded-md border-2 border-green-300 p-2",
      )}
    >
      <form onSubmit={submitHandler} ref={formRef} className="space-y-3">
        <div className="flex items-end gap-2">
          <LabelInput
            label="email"
            name="newEmail"
            defaultValue={email || ""}
            focus={true}
            onChange={(e) => setDiffEmail(e.target.value !== email)}
            className="w-full"
            error={validError}
          />
          {diffEmail && (
            <Button onClick={sendmail} variant={"success"} disabled={isSending}>
              {didSendCode ? "Resend" : "Send"} Verify Code
            </Button>
          )}
        </div>

        {didSendCode && (
          <div className="flex items-end gap-3">
            <LabelInput
              label="Email change code (until 2 min)"
              type="text"
              name="emailChangeCode"
              error={validError}
              placeholder="input code..."
            />
            <Button
              onClick={confirmAndSave}
              variant={"primary"}
              disabled={isSending}
            >
              Confirm Code & Save
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
