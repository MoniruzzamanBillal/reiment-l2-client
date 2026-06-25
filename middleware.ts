import { NextRequest, NextResponse } from "next/server";
import { authKey } from "./utils/constants/storageKey";

const ADMIN_ROUTES = ["/dashboard/admin"];
const VENDOR_ROUTES = ["/dashboard/vendor"];
const CUSTOMER_ROUTES = ["/dashboard/customer"];
const PROTECTED_ROUTES = ["/dashboard", "/cart", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(authKey)?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf-8")
      );
      const role: string = payload.userRole;

      if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (VENDOR_ROUTES.some((r) => pathname.startsWith(r)) && role !== "VENDOR") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        CUSTOMER_ROUTES.some((r) => pathname.startsWith(r)) &&
        role !== "CUSTOMER"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(authKey);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cart", "/checkout"],
};
