import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from '../db.client';
import config from '../config/config';

const opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret
};

const strategy = new JwtStrategy(opt, async (payload, done) => {
  try {
    if (!payload.id) {
      return done(null, false);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

export default strategy;
