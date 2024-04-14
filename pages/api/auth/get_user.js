import { getIronSession } from "iron-session";
export default async function handler(req, res) {
    const session = await getIronSession(req, res, {
        cookieName: "EquityUser",
        password: "77e8ad3fcd06b471b0c0f1a3e4f9bd30a7708c1f",
        secure: false,//should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    });
    if (session) {
        let data = session.user
        res.status(200).json({ data });
    }
    else {
        res.status(200).json(false);
    }
}
