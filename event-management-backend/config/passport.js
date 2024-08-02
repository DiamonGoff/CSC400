const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User'); // Your User model

console.log('FACEBOOK_CLIENT_ID:', process.env.FACEBOOK_CLIENT_ID);
console.log('FACEBOOK_CLIENT_SECRET:', process.env.FACEBOOK_CLIENT_SECRET);
console.log('TWITTER_CONSUMER_KEY:', process.env.TWITTER_CONSUMER_KEY);
console.log('TWITTER_CONSUMER_SECRET:', process.env.TWITTER_CONSUMER_SECRET);

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/facebook/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      user = new User({ facebookId: profile.id, name: profile.displayName });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:3001/auth/twitter/callback"
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ twitterId: profile.id });
    if (!user) {
      user = new User({ twitterId: profile.id, name: profile.displayName });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
