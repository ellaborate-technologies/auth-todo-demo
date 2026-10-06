import { ServiceError } from '../errors/ServiceError.js'

export const errorHandler = (err, req, res, _next) => {
  if (err instanceof ServiceError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details
    })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'A user with this email already exists.'
    })
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message)
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error.'
  })
}

export default errorHandler
