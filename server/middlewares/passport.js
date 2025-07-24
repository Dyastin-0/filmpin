const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/user");

const callbackURL =
  process.env.NODE_ENV == "development"
    ? "/auth/google/callback"
    : `${process.env.BASE_CLIENT_URL}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
    },
    async (_, __, profile, done) => {
      try {
        let user = await Users.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const isEmailUsed = await Users.findOne({
          email: profile.emails[0].value,
        });

        if (isEmailUsed) {
          return done(null, false, {
            message: "An account with this email already exists.",
          });
        }

        user = await Users.create({
          profileImageURL: profile.photos[0].value,
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          verified: true,
          roles: ["122602"],
        });

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
