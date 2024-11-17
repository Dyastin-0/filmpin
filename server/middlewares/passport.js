const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/user");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        let user = await Users.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, null);
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
