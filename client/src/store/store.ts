import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import { AppColorTheme, TUser } from 'types/global'
import { API_URL } from '../api/axios'
import { AuthService } from '../services/auth.service'

type UItheme = {
  state: AppColorTheme
  dispatch: React.Dispatch<string>
}

export class Store {
  user: TUser | null = null
  isLoading = false

  UItheme: UItheme | undefined = undefined

  inMemoryToken: string | undefined | null = undefined

  constructor() {
    makeAutoObservable(this)
  }

  setUser(user: typeof Store.prototype.user) {
    this.user = user
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  setInMemoryToken(token: string | null) {
    this.inMemoryToken = token
  }

  setUItheme(state: UItheme['state'], dispatch: UItheme['dispatch']) {
    this.UItheme = { state, dispatch }
  }

  async login(email: string, password: string) {
    try {
      const res = await AuthService.login(email, password)
      if (res.status === 200) {
        this.setInMemoryToken(res.data.accessToken)
        this.setUser(res.data.user)
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
            this.setUser(res.data.user)
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
