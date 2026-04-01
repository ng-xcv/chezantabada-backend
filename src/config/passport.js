import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

passport.use(new JwtStrategy(
  { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET || 'fallback' },
  async ({ id }, done) => {
    try {
      const user = await User.findById(id).select('-password')
      return user ? done(null, user) : done(null, false)
    } catch (err) { return done(err, false) }
  }
))

if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (at, rt, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id })
        if (!user) {
          user = await User.create({
            googleId: profile.id, email: profile.emails[0].value,
            firstName: profile.name.givenName, lastName: profile.name.familyName,
            avatar: profile.photos[0]?.value, isVerified: true,
          })
        }
        return done(null, user)
      } catch (err) { return done(err, null) }
    }
  ))
}
