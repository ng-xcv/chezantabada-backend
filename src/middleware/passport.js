import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

export function configurePassport(passport) {
  // ─── JWT Strategy ───
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id)
        if (!user) return done(null, false)
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  ))

  // ─── Google Strategy ───
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
    passport.use(new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  `${process.env.API_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id })
          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value })
            if (user) {
              user.googleId = profile.id
              user.avatar   = user.avatar || profile.photos[0]?.value
              await user.save()
            } else {
              user = await User.create({
                googleId:  profile.id,
                firstName: profile.name.givenName,
                lastName:  profile.name.familyName,
                email:     profile.emails[0].value,
                avatar:    profile.photos[0]?.value,
              })
            }
          }
          return done(null, user)
        } catch (err) {
          return done(err, false)
        }
      }
    ))
  }
}
