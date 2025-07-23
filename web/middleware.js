// src/middleware.js or middleware.js at root
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/login", "/signup"], // Pages that don't require login
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
