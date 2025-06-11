import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../../../user/user.model";
import * as bcrypt from 'bcrypt';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        const userIdentity = await UserModel.findOne({'email': email});
        if (!userIdentity) {
          return done(null, false, { message: `email ${email} not found` });
        }
        const match = await bcrypt.compare(password, userIdentity.password);
        if (match) {
          userIdentity.password = "";
          return done(null, userIdentity.toObject())
        }
        done(null, false, { message: 'invalid password' });
      } catch(err) {
        done(err);
      }
    }
  ))