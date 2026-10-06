import { APP_CONFIG } from '../../config/app.config'

export const AUTH_API = {
  LOGIN: `${APP_CONFIG.API_BASE_URL}/api/v1/auth/login`,
  REGISTER: `${APP_CONFIG.API_BASE_URL}/api/v1/auth/register`,
  ME: `${APP_CONFIG.API_BASE_URL}/api/v1/auth/me`,
  LOGOUT: `${APP_CONFIG.API_BASE_URL}/api/v1/auth/logout`
}
