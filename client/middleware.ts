import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/editor(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // console.log(isProtectedRoute(req))
  if (isProtectedRoute(req)) {
    const session = await auth();
    // console.log(session)
    if (!session.userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/editor(.*)"],
};