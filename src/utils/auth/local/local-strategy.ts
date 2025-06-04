import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserIdentity } from "./user-identity.model";
import * as bcrypt from 'bcrypt';

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, async (email, password, done) => {
      try {
        const identity = await UserIdentity.findOne({'credentials.email': email});
        if (!identity) {
          return done(null, false, {message: `email ${email} not found`});
        }
        const match = await bcrypt.compare(password, identity.credentials.hashedPassword);
        // vado a convertirlo in oggetto semplice per eliminare i metodi di mongoose
        
        const plainUser = identity.toObject().contoCorrente;
        
        if (match) {
          return done(null, plainUser);
        }
        done(null, false, {message: 'invalid password'});
      } catch (err) {
        done(err);
      }
  })
)