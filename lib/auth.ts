import NextAuth from "next-auth";
import Credential from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google,
    Kakao,
    Naver,
    Github,
    Credential({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@bookmark.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "pasword...",
        },
      },
      async authorize(credentials) {
        console.log("credentials>>", credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      return true;
    },
    async jwt({ token, user }) {
      // jwt 방식, GET /api/auth/callback/google에서는 없음
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
      }
      return session;
    },
  },
  trustHost: true,
  jwt: { maxAge: 30 * 60 },
  pages: {
    signIn: `/sign`,
    error: `/sign/error`,
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET as string,
});
