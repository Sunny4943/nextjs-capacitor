import { withIronSession } from "next-iron-session";

function handler(req, res, session) {
    req.session.destroy();
    res.json(true)
}

export default withIronSession(handler, {
    password: "77e8ad3fcd06b471b0c0f1a3e4f9bd30a7708c1f",
    cookieName: "EquityUser",
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});