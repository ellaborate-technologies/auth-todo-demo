export class ServiceError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message)
    this.name = 'ServiceError'
    this.statusCode = statusCode
    this.details = details
  }
}

export default ServiceError
