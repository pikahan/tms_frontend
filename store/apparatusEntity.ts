// @ts-ignore
import allApparatusEntities from '@/apollo/queries/allApparatusEntities.gql'
// import createOne from '@/apollo/mutations/family/createOne.gql'
// import updateOne from '@/apollo/mutations/family/updateOne.gql'
// import deleteOne from '@/apollo/mutations/family/deleteOne.gql'

import { storeTemp } from '@/util/helper'
import {UserData} from './user'
import {State} from '../util/helper'
import {ApparatusDefData} from './apparatusDef'
import {FamilyData} from './family'

type ApparatusEntityStatus = '在库'| '线上' | '临时领出' | '维修' | '报废'

export interface ApparatusEntityData {
  id: number
  billNo: String
  def: ApparatusDefData
  defId: number
  seqId: number
  status: ApparatusEntityStatus
  location: string
  picture: Array<number>
  regDate: string
  usedCount: number
  usedHours: number
}

interface ProcessedApparatusEntityData extends ApparatusDefData {
  key: number
  billNo: String
  // def: ApparatusDefData | null
  defId: number
  seqId: number
  status: ApparatusEntityStatus
  location: string
  picture: Array<number>
  familyName: string
  regDate: string
  usedCount: number
  usedHours: number
}

export default storeTemp('apparatusEntity', { allData: allApparatusEntities }, undefined, {
  getters: {
    processedApparatusEntityData: (state: State<ApparatusEntityData>) => {
      const ret = <Array<ProcessedApparatusEntityData>>[]
      state.data.forEach((apparatusData, i) => {
        const { def, id: key, ...data } = apparatusData
        const { family } = def
        ret.push({
            familyName: family.name,
            ...def,
            ...data,
            key
        })
      })
      return ret
    },
  }
})


