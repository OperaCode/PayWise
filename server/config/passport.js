const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel"); // Import user model
require("dotenv").config();

const initialize = () => {
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ["profile", "email"],
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              let user = await User.findOne({ googleId: profile.id });
      
              if (!user) {
                // Create a new user if not found
                user = new User({
                  googleId: profile.id,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  email: profile.emails[0].value,
                  password: "", // No password for OAuth users
                  wallet: {
                    balance: 0,
                    walletId: require("uuid").v4(),
                  },
                });
                await user.save();
              }
      
              return done(null, user);
            } catch (error) {
              return done(error, null);
            }
          }
        )
      );
      
      // TO Serialize User
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      // Deserialize User
      passport.deserializeUser(async (id, done) => {
        try {
          const user = await User.findById(id);
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      });
}


module.exports = initialize;