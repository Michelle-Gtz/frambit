import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/inngest", // 👈 REQUIRED for Inngest
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect(); // ✅ correct API
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
