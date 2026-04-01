import passport from 'passport'

export const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Non autorisé — veuillez vous connecter' })
    req.user = user
    next()
  })(req, res, next)
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux administrateurs' })
  next()
}
