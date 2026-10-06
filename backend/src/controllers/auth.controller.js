import { AuthService } from '../services/auth.service.js'

export class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body || {}
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email and password are required.'
        })
      }

      const result = await AuthService.register({ username, email, password })
      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body || {}
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        })
      }

      const result = await AuthService.login({ email, password })
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async me(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id)
      return res.status(200).json({
        success: true,
        data: { user }
      })
    } catch (error) {
      next(error)
    }
  }

  static async logout(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    })
  }
}

export default AuthController
