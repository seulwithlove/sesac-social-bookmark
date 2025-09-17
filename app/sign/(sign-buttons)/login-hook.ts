import { useSearchParams } from "next/navigation";
import { login, type Provider } from "../sign.action";

export function useLogin() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (provider: Provider) => {
    login(provider, redirectTo);
  };
}
