// @ts-ignore
import allUsers from '@/apollo/queries/allUsers.gql'
// @ts-ignore
import createOne from '@/apollo/mutations/user/createOne.gql'
// @ts-ignore
import updateOne from '@/apollo/mutations/user/updateOne.gql'
// @ts-ignore
import auth from '@/apollo/queries/auth.gql'
import { storeTemp, State } from '@/util/helper'
import { Workcell } from './workcell'

export interface UserCreateQuery {
  index?: number
  password: string
  employeeId: string
  workcellId: number
  userTypeId: number
}

export interface UserUpdateQuery {
  password?: string
  employeeId?: string
  workcellId?: number
  userTypeId?: number
}

export interface UserType {
  id: number
  name: string
  permission: number
}

export interface UserData {
  id?: number
  employeeId: string
  userType: UserType
  workcell: Workcell
  workcellId?: number
  passward?: string
}

interface ProcessedUserData {
  index: number
  key: number
  employeeId: string
  workcell: string
  workcellId: number
  userType: string
  userTypeId: number
}

export default storeTemp('user', { allData: allUsers }, { createOne, updateOne }, {
  state: {
    passwordState: {
      message: '',
      status: 'validating'
    },
  },
  getters: {
    processedUserData: (state: State<UserData>) => {
      const ret = <Array<ProcessedUserData>>[]
      state.data.forEach((userData, i) => {
        ret.push({
          index: i,
          key: userData.id ? userData.id : 0,
          employeeId: userData.employeeId,
          workcell: userData.workcell.name,
          workcellId: <number>userData.workcellId,
          userType: userData.userType.name,
          userTypeId: userData.userType.id
        })
      })
      return ret
    }
  },
  mutations: {
    setPasswordState: (state: State<any>, data: any) => {
      state.passwordState = data
    }
  },
  actions: {
    async login({ commit }: any, userData: UserData) {
      let client = (this as any).app.apolloProvider.defaultClient

      try {
        console.log(userData)
        // const { remeber, ...variables } = userData
        let rep = await client.query({
          query: auth,
          variables: { ...userData }
        })
        if (typeof rep.errors !== 'undefined') {
          // 密码错误
          return commit('setPasswordState', { message: rep.errors.message, status: 'error' })
        }
        const token = rep.data.auth.token
        await (this as any).app.$apolloHelpers.onLogin(token, undefined, { expires: 1/24 })
        return commit('setPasswordState', { message: '', status: 'success' })

      } catch (e) {
        commit('setPasswordState', { message: e.message, status: 'error' })
      }
    }
  }
})

