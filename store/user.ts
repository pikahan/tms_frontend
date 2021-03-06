// @ts-ignore
import allUsers from '@/apollo/queries/allUsers.gql'
// @ts-ignore
import createOne from '@/apollo/mutations/user/createOne.gql'
import create from '@/apollo/mutations/user/create.gql'
import deleteAll from '@/apollo/mutations/user/deleteAll.gql'
// @ts-ignore
import updateOne from '@/apollo/mutations/user/updateOne.gql'
import update from '@/apollo/mutations/user/update.gql'

// @ts-ignore
import auth from '@/apollo/queries/auth.gql'
import { storeTemp, State } from '@/util/helper'
import { Workcell } from './workcell'
import MyStorage from '../util/storage'

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

export interface UserInfo {
  id: number
  name: string
  permission: number
  userTypeName: string
}

export interface UserData {
  id?: number
  employeeId: string
  userType: UserType | string
  workcell: Workcell
  workcellId?: number
  mail: string
  passward?: string
}

const EXPIRES = 1000 * 60 * 60

interface ProcessedUserData {
  id: number
  index: number
  key: number
  mail: string
  employeeId: string
  workcell: string
  workcellId: number
  userType: string
  userTypeId: number
}

export default storeTemp('user', { allData: allUsers }, { createOne, updateOne, create, deleteAll, update }, {
  state: {
    passwordState: {
      message: '',
      status: 'validating'
    },
    userInfo: {}
  },
  getters: {
    processedUserData: (state: State<UserData>) => {
      const ret = <Array<ProcessedUserData>>[]
      state.data.forEach((userData, i) => {
        console.log(userData)
        ret.push({
          index: i,
          key: userData.id ? userData.id : 0,
          mail: userData.mail ? userData.mail : '暂无',
          employeeId: userData.employeeId,
          workcell: userData.workcell.name,
          workcellId: <number>userData.workcellId,
          userType: userData.userType.name ,
          userTypeId: userData.userType.id,
          id: userData.id ? userData.id : 0,
        })
      })
      return ret
    },
    permissionMap(state: State<UserData>) {
      const ret: any = {}
      state.userInfo.permissions.forEach((permissionObj: {value: boolean, name: string}) => {
        ret[permissionObj.name] = permissionObj.value
      })
      return ret
    }
  },
  mutations: {
    setPasswordState: (state: State<any>, data: any) => {
      state.passwordState = data
    },
    setUserInfo: (state: State<any>, data: UserInfo) => {
      state.userInfo = data
    }
  },
  actions: {
    async login({ commit }: any, userData: UserData) {
      let client = (this as any).app.apolloProvider.defaultClient
      let storageUserData
      try {

        let permissions = [
          {'name': 'WarehouseIn', 'value': false, '__typename': 'PermissionStatus'},
          {
            'name': 'WarehouseOut',
            'value': false,
            '__typename': 'PermissionStatus',
          },
          {'name': 'TempWarehouseIn', 'value': false, '__typename': 'PermissionStatus'},
          {
            'name': 'TempWarehouseOut',
            'value': false,
            '__typename': 'PermissionStatus',
          },
          {
            'name': 'RepairApplication',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {
            'name': 'RepairApplicationProcess',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {
            'name': 'ClampingApparatusInformationMutation',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {
            'name': 'DisposalApplication',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {
            'name': 'DisposalApplicationMiddleProcess',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {
            'name': 'CategoryMutation',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {
            'name': 'DisposalApplicationFinalProcess',
            'value': false,
            '__typename': 'PermissionStatus',
          }, {'name': 'SystemManagement', 'value': false, '__typename': 'PermissionStatus'}]


        if (userData.userType === '游客') {
          storageUserData = {
            employeeId: '游客',
            typeName: '游客',
            permissions,
            workcellId: userData.workcellId
          }
        } else {

          let rep = await client.query({
            query: auth,
            variables: { ...userData }
          })
          if (typeof rep.errors !== 'undefined') {

            // 密码错误
            return commit('setPasswordState', { message: rep.errors.message, status: 'error' })
          }
          const token = rep.data.auth.token
          await (this as any).app.$apolloHelpers.onLogin(token, undefined, { expires: 1/24 / 1000 / 60 / 60 * EXPIRES })

          let userRes = await client.query({
            query: allUsers,
            variables: {
              employeeId: userData.employeeId
            }
          })
          console.log(userRes)
          let currUserData = userRes.data.users.payload[0]

          const { permission, name: typeName, permissions } = currUserData.userType
          console.log(JSON.stringify(permissions))
          storageUserData = {
            employeeId: userData.employeeId,
            permission,
            typeName,
            permissions,
            mail: currUserData.mail,
            id: currUserData.id,
            workcellId: currUserData.workcellId,
          }
        }



        let storage = new MyStorage();
        storage.set('userInfo', storageUserData, EXPIRES)
        commit('setUserInfo', storageUserData)

        return commit('setPasswordState', { message: '', status: 'success' })

      } catch (e) {
        commit('setPasswordState', { message: e.message, status: 'error' })
      }
    }
  }
})


