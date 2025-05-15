import { $api } from 'api'

export class AuthService {
  static async login(email: string, password: string) {
    return $api.post('/login', { email, password })
  }

  static async logout() {
    return $api.post('/logout')
  }
}
