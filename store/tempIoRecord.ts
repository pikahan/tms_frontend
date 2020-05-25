// @ts-ignore
import allIoRecords from '@/apollo/queries/allTempIoRecords.gql'
import createOne from '@/apollo/mutations/tempIoRecord/createOne.gql'
import updateOne from '@/apollo/mutations/tempIoRecord/updateOne.gql'
import deleteOne from '@/apollo/mutations/tempIoRecord/deleteOne.gql'

import { storeTemp } from '@/util/helper'
import {ApparatusEntityData, ApparatusEntityStatus} from './apparatusEntity'
import {State} from '../util/helper'



export interface FamilyCreateQuery {
  name: string
}

export interface TempIoRecordData {
  apparatusEntity: ApparatusEntityData
  apparatusEntityId: number
  id: number
  inHandlingPerson: string
  inRecordPerson: string
  position: string
  remark: string
  outHandlingPerson: string
  outRecordPerson: string
}

interface ProcessedTempIoRecordData {
  billNo: String
  code: string
  models: string
  apparatusDefName: string
  owner: string
  partNos: string
  pMPeriod: number
  recBy: string
  recOn: string
  uPL: string
  defId: number
  seqId: number
  status: ApparatusEntityStatus
  location: string
  picture: Array<number>
  regDate: string
  apparatusEntityId: number
  id: number
  inHandlingPerson: string
  inRecordPerson: string
  outHandlingPerson: string
  outRecordPerson: string
  position: string
  remark: string
}

export default storeTemp('tempIoRecord', { allData: allIoRecords }, { createOne, updateOne, deleteOne }, {
  getters: {
    processedIoRecordData: (state: State<TempIoRecordData>) => {
      const ret = <Array<ProcessedTempIoRecordData>>[]
      state.data.forEach((ioRecordData, i) => {
        const { apparatusEntity, ...otherData } = ioRecordData
        const { def, ...data } = apparatusEntity
        const { family, name, ...otherDefData } = def
        ret.push({
          apparatusDefName: name,
          ...otherDefData,
          ...data,
          ...otherData
        })
      })
      console.log(ret)
      return ret
    },
  }
})
