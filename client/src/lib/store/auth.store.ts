import { API_URL } from '@/lib/axios'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { UserRole } from 'models'
import { AuthService } from '../services/auth.service'

export class User {
  constructor(
    readonly id: number,
    readonly roles: UserRole[] | null,
    readonly firstName: string,
    readonly lastName: string | null,
    readonly email: string | null,
  ) {}

  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`.trim()
  }
  get shortName() {
    return `${this.firstName} ${this.lastName?.slice(0, 1)}`.trim()
  }
}

export class AuthStore {
  user: User | null = null
  setUser(user: User | null) {
    this.user = user
  }
  isLoading = false
  setLoading(bool: boolean) {
    this.isLoading = bool
  }
  token: string | null = null
  setToken(token: string | null) {
    this.token = token
  }
  constructor() {
    makeAutoObservable(this)
  }

  async logout() {
    try {
      await AuthService.logout()
      this.setToken(null)
      this.setUser(null)
    } catch (e: any) {
      console.log(e.response?.data?.message)
    }
  }

  async refresh() {
    return await axios
      .get(`${API_URL}/refresh`, { withCredentials: true })
      .then(r => {
        if (r.status !== 200)
          new Error('Invalid response while trying to get new access token')
        this.setToken(r.data.accessToken)
        return r.data.accessToken
      })
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      await axios
        .get(`${API_URL}/refresh`, { withCredentials: true })
        .then(res => {
          if (res.status === 200) {
            this.setUser(
              new User(
                res.data.user.id,
                res.data.user.roles,
                res.data.user.first_name!,
                res.data.user.last_name,
                res.data.user.email,
              ),
            )
            this.setToken(res.data.accessToken)
          }
        })
    } catch (e) {
      console.error(e)
    } finally {
      this.setLoading(false)
      return this.token
    }
  }
}

export const authStore = new AuthStore()
