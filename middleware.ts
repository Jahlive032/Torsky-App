import { ClerkMiddlewareOptions, authMiddleware, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/"
];

interface ExtendedClerkMiddlewareOptions extends ClerkMiddlewareOptions {
  publicRoutes: string[];
}

const clerkOptions: ExtendedClerkMiddlewareOptions = {
  publicRoutes: publicRoutes
};

// Ajouter 'req' comme paramètre pour correspondre à la signature de la fonction 'afterAuth'
function afterAuth(auth: any, req: any) {
  if (auth.userId && auth.isPublicRoute) {
    let path = "/select-org";

    if(auth.orgId){
      path = '/organization/${auth.orgId}'
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if(!auth.userId && !auth.isPublicRoute){
    return auth().redirectToSignIn({returnBackUrl: req.url})
  }

  if(auth.userId && !auth.orgId && req.NextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url)
    return NextResponse.redirect(orgSelection)
  }
}
export default clerkMiddleware(clerkOptions, afterAuth);

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

