import { User } from '../db/models/user.model.js'
import { hashPassword, comparePassword } from '../helpers/password.helper.js'
import { generateToken } from '../libs/jwt.js'
import { ServiceError } from '../errors/ServiceError.js'

export class AuthService {
  static async register({ username, email, password }) {
    const normalizedEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ where: { email: normalizedEmail } })

    if (existing) {
      throw new ServiceError('An account with this email already exists.', 409)
    }

    const passwordHash = await hashPassword(password)
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      passwordHash
    })

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    })

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    }
  }

  static async login({ email, password }) {
    const normalizedEmail = (email || '').toLowerCase().trim()
    const user = await User.findOne({ where: { email: normalizedEmail } })

    if (!user) {
      throw new ServiceError('Invalid email or password.', 401)
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      throw new ServiceError('Invalid email or password.', 401)
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    })

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    }
  }

  static async getCurrentUser(userId) {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new ServiceError('User account not found.', 404)
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
}

export default AuthService
