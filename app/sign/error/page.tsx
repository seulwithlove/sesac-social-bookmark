import Divider from "@/components/divider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from "react";
import ResendRegist from "./resend-regist";

type Props = {
  searchParams: Promise<{ error: string; email?: string; emailcheck?: string }>;
};

const getMessage = (error: string) => {
  if (error === "InvalidEmailCheck") return "Invalid Email Authorization Key!";
  if (error === "CheckEmail") return "Check Your Email, Plz";
  if (error === "EmailSendFail") return "Fail to Send Email!";
};

export default function AuthError({ searchParams }: Props) {
  const { error, email, emailcheck } = use(searchParams);

  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <h1 className="mb-5 font-semibold text-2xl">{error}</h1>
        <div className="mb-5 text-red-500">{getMessage(error)}</div>

        <div className="item-center flex flex-col gap-3">
          <Button variant={"outline"} asChild={true}>
            <Link href={`/sign?email=${email}`}>Go to Login</Link>
          </Button>
          {error === "CheckEmail" && email && emailcheck && (
            <>
              <Divider label="or" />
              <ResendRegist email={email} emailcheck={emailcheck} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
