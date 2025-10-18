import NextAuth, { AuthError } from "next-auth";
import Credential from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import z from "zod";
import prisma, { findMemberByEmail } from "./db";
import { comparePassword, validateObject } from "./validator";

export const MAX_AGE = 30 * 60; // session을 유지할 시간 - middleware에서도 사용

/**
 * 📌 NextAuth 설정 - 인증 시스템의 핵심
 *
 * Providers:
 * 1. OAuth: Google, Kakao, Naver, Github
 * 2. Credential: 이메일/비밀번호
 *
 * Callbacks:
 * 1. signIn: 로그인 시 DB 검증 및 사용자 정보 설정
 * 2. jwt: JWT 토큰에 사용자 정보 저장
 * 3. session: 클라이언트에 전달할 Session 데이터 설정
 *
 * Flow:
 * - OAuth: login() → signIn(provider) → OAuth Provider → callback → signIn callback → jwt callback → session callback
 * - Credential: authorize() → signIn('credentials', data) → Credential provider → signIn callback → jwt callback → session callback
 */
export const {
  handlers: { GET, POST }, // API route handlers (/api/auth/[...nextauth]/route.ts)
  auth, // Session 조회 함수 (서버 컴포넌트, 미들웨어)
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // refresh_token을 받을수 있도록 함
          response_type: "code",
        },
      },
    }),
    Kakao,
    Naver,
    Github,
    Credential({
      credentials: {
        email: {},
        passwd: {},
      },
      /**
       * authorize 함수 - Credential 인증 시 호출
       *
       * Flow:
       * 1. credentials 유효성 검사 (zod)
       * 2. 성공 시 data 반환 → signIn callback으로 전달
       * 3. 실제 비밀번호 검증은 signIn callback에서 수행
       */
      async authorize(credentials) {
        // console.log("credentials>>", credentials);
        const zobj = z.object({
          email: z.email("Invalid Email Format!"),
          passwd: z.string().min(6, "More than 6 characters!"),
        });

        const [err, data] = validateObject(zobj, credentials);
        if (err) return err;

        return data; // signIn callback으로 전달
      },
    }),
  ],
  // Callbacks - 인증 프로세스의 각 단계에서 호출
  callbacks: {
    /**
     * 📌 signIn callback - 로그인 시 DB 검증 및 사용자 정보 설정
     *
     * OAuth와 Credential 모두 이 callback을 거침
     *
     * Flow:
     * 1. provider 타입 확인 (credentials vs OAuth)
     * 2. DB에서 이메일로 회원 조회
     * 3. emailcheck 있으면 이메일 미인증 → 에러 페이지 리다이렉트
     * 4. Credential: 비밀번호 검증, 탈퇴 여부 확인
     * 5. OAuth: 회원 없으면 자동 생성
     * 6. user 객체에 DB 정보 설정 (id, name, image, isadmin)
     * 7. return true → jwt callback으로 전달
     *
     * @param user - authorize()에서 반환한 데이터 or OAuth user 정보
     * @param account - provider 정보 (provider, providerAccountId 등)
     * @returns true | false | string (string은 redirect URL)
     */
    async signIn({ user, account }) {
      console.log("account", account);
      const isCredential = account?.provider === "credentials";
      const { email, name: nickname, image } = user;
      if (!email) return false;

      let mbr = await findMemberByEmail(email, isCredential);
      console.log("💻 - auth.ts - mbr:", mbr);
      if (mbr?.emailcheck) {
        return `/sign/error?error=CheckEmail&email=${email}&emailcheck=${mbr.emailcheck}`;
      }

      // const authError = new AuthError();
      if (isCredential) {
        if (!mbr) throw authError("Not Exists Member!", "EmailSignInError");
        if (mbr.outdt) {
          throw authError("Withdrawed Member!", "AccessDenied");
        } // 탈퇴한 유저
        if (!mbr.passwd)
          throw authError("RegistedBySNS", "OAuthAccountNotLinked");

        const isValidPasswd = await comparePassword(
          user.passwd ?? "",
          mbr.passwd,
        );
        if (!isValidPasswd)
          throw authError("Invalid Password!", "CredentialsSignin");
      } else {
        // sns login
        if (!mbr) {
          mbr = await prisma.member.create({
            data: { email, nickname: nickname || "guest", image },
          });
        }
      }

      // user 객체에 DB 정보 설정 (jwt callback으로 전달)
      user.id = String(mbr.id);
      user.name = mbr.nickname;
      if (mbr.image) user.image = mbr.image;
      user.isadmin = mbr.isadmin;

      return true;
    },

    /**
     * 📌 jwt callback - JWT 토큰에 사용자 정보 저장
     *
     * Flow:
     * 1. signIn callback에서 설정한 user 정보를 token에 저장
     * 2. trigger === "update" 시 Session 업데이트 (session 데이터를 token에 반영)
     * 3. token 반환 → session callback으로 전달
     *
     * @param token - JWT 토큰
     * @param user - signIn callback에서 설정한 user 정보
     * @param trigger - "signIn" | "update" | "signUp"
     * @param session - update() 호출 시 전달된 데이터
     * @returns token
     */
    async jwt({ token, user, trigger, account, session }) {
      const userData = trigger === "update" ? session : user;

      // jwt 방식, GET /api/auth/callback/google에서는 없음
      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name || userData.nickname;
        token.image = userData.image;
        token.isadmin = userData.isadmin;
      }
      // token.exp = Math.floor(Date.now() / 1000) + 10 * 60;
      return token; // sns login일때 - session callback으로 전달
    },

    /**
     * 📌 session callback - 클라이언트에 전달할 Session 데이터 설정
     *
     * Flow:
     * 1. token에서 사용자 정보를 추출
     * 2. session.user에 설정
     * 3. session 반환 → 클라이언트에서 useSession()으로 접근 가능
     *
     * @param session - 기본 session 객체
     * @param token - jwt callback에서 반환한 token
     * @returns session
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isadmin = token.isadmin;
        // if (token.exp) session.expires = new Date(token.exp * 1000);
      }
      return session;
    },
  },

  trustHost: true, // Vercel 등 호스팅 환경에서 필요
  jwt: { maxAge: MAX_AGE },
  pages: {
    signIn: "/sign",
    error: "/sign/error",
  },
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE, // default: 1 month
    // updateAge: 10,  // 쿠키 굽는 단위시간(10초)
  },
});

function authError(message: string, type: AuthError["type"]) {
  const authError = new AuthError(message);
  authError.type = type as typeof authError.type;
  throw authError;
}
