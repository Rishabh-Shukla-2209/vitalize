import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/forgot-password",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  const { isAuthenticated, sessionClaims } = await auth();

  if (isAuthenticated) {
    const userId = sessionClaims.sub;
    const hasOnboarded = sessionClaims.hasOnboarded;    
    const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");

    if (!hasOnboarded && !isOnboardingPage) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (isPublicRoute(req)|| (hasOnboarded && isOnboardingPage)) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    const match = req.nextUrl.pathname.match(/^\/community\/user\/([^\/]+)/);

    if (match) {
      const routeUserId = match[1];
      
      if (routeUserId === userId) {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};



