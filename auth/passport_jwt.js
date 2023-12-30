import { Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";
import { config } from "dotenv";

const cookieExtractor = (req) => {
  return req?.signedCookies ? req.signedCookies["token"] : null;
};

const tokenFromHeaderAuthorization = (req) => {
  const authorization = req?.headers?.authorization;
  console.log(authorization,"hello world");
  if (authorization) {
    const token = authorization.split(" ")[1];
    return token;
  }
  return null;
};

config();

const opts = {
  jwtFromRequest: (req) => {
    const tokenFromHeader = tokenFromHeaderAuthorization(req);
    const tokenFromCookie = cookieExtractor(req);
    return tokenFromHeader || tokenFromCookie;
  },
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
  console.log(jwt_payload, "jwt_payload");
  if (jwt_payload) {
    return done(null, jwt_payload);
  }
  return done(null, false);
});

passport.use(jwtStrategy);

export default passport;
