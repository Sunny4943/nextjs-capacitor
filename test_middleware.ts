// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
//import { getIronSession } from "iron-session";
export const middleware = async (req: NextRequest) => {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
        cookieName: "EquityUser",
        password: "77e8ad3fcd06b471b0c0f1a3e4f9bd30a7708c1f",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    });

    const user = session;
    const temp_user = JSON.parse(JSON.stringify(user))
    if (session === undefined || session === null) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (temp_user['user']) {
        console.log("from middleware", temp_user['user']['usercode']);

        if (!temp_user['user']) {
            // unauthorized to see pages inside admin/
            // return NextResponse.rewrite()
            return NextResponse.redirect(new URL('/', req.url))// redirect to /unauthorized page
        }
        if (temp_user['user']['usercode'] === "ADMIN") {
            return res;
        }
        if (!(req.nextUrl.pathname.match(temp_user['user']['usercode']))) {
            return NextResponse.redirect(new URL('/', req.url))
            // return res;
        }
        return res;
    }
    else {
        return NextResponse.redirect(new URL('/', req.url))
        // return res;
    }
};


export const config = {
    matcher: '/src/:path*',
}
