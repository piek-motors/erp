import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { User } from 'models'
import { API_URL } from '../api/axios'
import { AuthService } from '../services/auth.service'

export class GlobalStore {
  user: User | null = null
  setUser(user: User | null) {
    this.user = user
  }
  isLoading = false
  setLoading(bool: boolean) {
    this.isLoading = bool
  }
  inMemoryToken: string | null = null
  setInMemoryToken(token: string | null) {
    this.inMemoryToken = token
  }
  constructor() {
    makeAutoObservable(this)
  }

  async login(email: string, password: string) {
    try {
      const res = await AuthService.login(email, password)
      if (res.status === 200) {
        this.setInMemoryToken(res.data.accessToken)
        this.setUser(
          new User(
            res.data.user.id,
            res.data.user.role,
            res.data.user.first_name!,
            res.data.user.last_name,
            res.data.user.email
          )
        )
        return res
      }
    } catch (e) {
      console.log(e)
    }
  }

  async logout() {
    try {
      await AuthService.logout()
      this.setInMemoryToken(null)
      this.setUser(null)
    } catch (e: any) {
      console.log(e.response?.data?.message)
    }
  }

  async getNewToken() {
    return await axios
      .get(`${API_URL}/refresh`, { withCredentials: true })
      .then(r => {
        if (r.status !== 200)
          new Error('Invalid response while trying to get new access token')
        this.setInMemoryToken(r.data.accessToken)
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
                res.data.user.role,
                res.data.user.first_name!,
                res.data.user.last_name,
                res.data.user.email
              )
            )
            this.setInMemoryToken(res.data.accessToken)
          }
        })
    } catch (e) {
      console.error(e)
    } finally {
      this.setLoading(false)
      return this.inMemoryToken
    }
  }
}
