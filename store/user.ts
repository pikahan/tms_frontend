// @ts-ignore
import allUsers from '@/apollo/queries/allUsers.gql'
import { storeTemp, State } from '@/util/helper'
import {Workcell} from './workcell'

export interface UserType {
  id: number
  name: string
  permission: number
}

export interface UserData {
  id: number
  employeeId: string
  userType: UserType
  workcell: Workcell
  workcellId?: number
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

export default storeTemp('user', { allData: allUsers } as any, null, {
  getters: {
    processedUserData: (state: State<UserData>) => {
      const ret = <Array<ProcessedUserData>>[]
      state.data.forEach((userData, i) => {
        ret.push({
          index: i,
          key: userData.id,
          employeeId: userData.employeeId,
          workcell: userData.workcell.name,
          workcellId: <number>userData.workcellId,
          userType: userData.userType.name,
          userTypeId: userData.userType.id
        })
      })
      return ret
    }
  }
})

