import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/editor(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const hasSessionCookie = req.headers.get("cookie")!.includes("__session=");
  if (isProtectedRoute(req) && !hasSessionCookie) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};