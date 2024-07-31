import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserType {
  name: string
  email: string
  password: string
  image: { url: string; id: string }
  currency: string
}

const userSchema = new mongoose.Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      url: { type: String, default:'', required: false },
      id: { type: String, default:'', required: false},
    },
    currency: { type: String, default: '$', required: false}
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

const User = mongoose.model<UserType>('User', userSchema)
export default User
