import { encode, getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { MAX_AGE } from "./lib/auth";

const REFRESH_THRESHOLD = 10 * 60 * 1000; // cookie 굽는 단위(시간: 10min)
const SALT = "authjs.session-token";
const SECRET = process.env.AUTH_SECRET || "";

const NEED_COOKIES = ["/"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  // console.log("💻 - middleware.ts - token:", token);

  // const ctoken = req.cookies.get(SALT); // browser's cookie
  // console.log("💻 - middleware.ts - ctoken:", ctoken);
  // if (ctoken) {
  //   const dectoken = await decode({
  //     token: ctoken.value,
  //     secret: SECRET,
  //     salt: SALT,
  //   });
  //   console.log("💻 - middleware.ts - dectoken:", dectoken);
  // }

  const pathname = req.nextUrl.pathname;
  if (!token && NEED_COOKIES.includes(pathname)) return NextResponse.next();

  if (!token)
    return NextResponse.redirect(
      new URL(`/sign?redirectTo=${pathname}`, req.url),
    );

  // const session = await auth(); // check if logged in
  // console.log("💻 - middleware.ts - session:", session);

  // const didLogin = !!session?.user?.email;
  // if (!didLogin) {
  //   return NextResponse.redirect(
  //     new URL(`/sign?redirectTo=${pathname}`, req.url),
  //   );
  // }

  const exp = token.exp ? token.exp * 1000 : 0; // undefined 대응
  console.log("💻 - middleware.ts - exp:", new Date(exp).toLocaleString());

  if (exp - Date.now() < MAX_AGE * 1000 - REFRESH_THRESHOLD) {
    // RT일때만 쿠키를 새로 구움
    const res = NextResponse.next();
    const newToken = await encode({
      token,
      secret: SECRET,
      salt: SALT,
      maxAge: MAX_AGE,
    });
    res.cookies.set({
      // 쿠키굽기
      name: SALT,
      value: newToken,
      maxAge: MAX_AGE, // 'undefined'면 브라우저 닫을때까지 유지 - e.g. 주차비 정산앱
      httpOnly: true, // js로 조작못하게 함
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // CORS 때문에 설정
      path: "/",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  // runtime: "nodejs",
  matcher: [
    "/((?!sign|_next/static|_next/image|api/auth|api/sendmail|forgotpasswd|registcheck|favicon.ico|robots.txt|.well-known|$).*)",
    // "/api/:path*",
    "/",
  ],
};
