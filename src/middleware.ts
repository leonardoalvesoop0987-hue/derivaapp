import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET ?? "deriva-dev-secret-do-not-use-in-production";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  if (path === "/" && (host.includes("comprarderiva.duckdns.org") || host.includes("comprarderivalove.duckdns.org"))) {
    return NextResponse.rewrite(new URL("/lp", request.url));
  }

  const isProtectedRoute = path.startsWith("/app");
  const isAdminRoute = path.startsWith("/admin");

  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    if (isAdminRoute && !payload.isAdmin) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/app/:path*", "/admin/:path*"],
};
