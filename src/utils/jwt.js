import jwt from 'jsonwebtoken'

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const formatUser = (user) => ({
  _id:       user._id,
  firstName: user.firstName,
  lastName:  user.lastName,
  email:     user.email,
  role:      user.role,
  avatar:    user.avatar,
})
