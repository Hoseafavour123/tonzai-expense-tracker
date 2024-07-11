import jwt from 'jsonwebtoken'

type userToConfirm = {
  name: string
  email: string
  password: string
  code: string
}

export const createOTPToken = (user: userToConfirm) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '10m',
  })
}
