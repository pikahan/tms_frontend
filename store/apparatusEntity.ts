// @ts-ignore
import allApparatusEntities from '@/apollo/queries/allApparatusEntities.gql'
import createOne from '@/apollo/mutations/apparatusEntity/createOne.gql'
import updateOne from '@/apollo/mutations/apparatusEntity/updateOne.gql'
import deleteOne from '@/apollo/mutations/apparatusEntity/deleteOne.gql'

import { storeTemp } from '@/util/helper'
import {UserData} from './user'
import {State} from '../util/helper'
import {default as apparatusDef, ApparatusDefData} from './apparatusDef'
import {FamilyData} from './family'

export type ApparatusEntityStatus = '在库'| '线上' | '临时领出' | '维修' | '报废'

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
}

interface ProcessedApparatusEntityData extends ApparatusDefData {
  id: number
  billNo: String
  // def: ApparatusDefData | null
  defId: number
  seqId: number
  status: ApparatusEntityStatus
  location: string
  picture: Array<number>
  familyName: string
  regDate: string
}

export default storeTemp('apparatusEntity', { allData: allApparatusEntities }, {createOne, updateOne, deleteOne}, {
  getters: {
    processedApparatusEntityData: (state: State<ApparatusEntityData>) => {
      const ret = <Array<ProcessedApparatusEntityData>>[]
      state.data.forEach((apparatusData, i) => {
        const { def, ...data } = apparatusData
        const { family } = def
        ret.push({
            familyName: family.name,
            ...def,
            ...data,
        })
      })
      return ret
    },
    filterApparatusEntityData: (state: State<ApparatusEntityData>) => {
      const ret = <Array<ApparatusEntityData>>[]
      const set = new Set()
      state.data.forEach((apparatusData, i) => {
        const { defId, ...data } = apparatusData
        if (set.has(defId)) {
          return
        }
        set.add(defId)
        ret.push(apparatusData)
      })
      return ret
    }
  }
})


