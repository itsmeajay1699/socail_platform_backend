import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { config } from "dotenv";

config();
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
  if (jwt_payload) {
    return done(null, jwt_payload);
  }
  return done(null, false);
});

passport.use(jwtStrategy);

export default passport;
