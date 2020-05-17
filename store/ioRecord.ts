// @ts-ignore
import allIoRecords from '@/apollo/queries/allIoRecords.gql'
import createOne from '@/apollo/mutations/ioRecord/createOne.gql'
import updateOne from '@/apollo/mutations/ioRecord/updateOne.gql'
import deleteOne from '@/apollo/mutations/ioRecord/deleteOne.gql'

import { storeTemp } from '@/util/helper'
import {ApparatusEntityData, ApparatusEntityStatus} from './apparatusEntity'
import {LineData} from './line'
import {State} from '../util/helper'
import {ApparatusDefData} from './apparatusDef'
import {FamilyData} from './family'


export interface FamilyCreateQuery {
  name: string
}

export interface IoRecordData {
  apparatusEntity: ApparatusEntityData
  apparatusEntityId: number
  id: number
  inHandlingPerson: string
  inRecordPerson: string
  inTime: string
  line: LineData
  lineId: number
  outHandlingPerson: string
  outRecordPerson: string
  outTime: string
}

interface ProcessedIoRecordData {
  billNo: String
  code: string
  familyName: string
  models: string
  apparatusDefName: string
  owner: string
  partNos: string
  pMPeriod: number
  recBy: string
  recOn: string
  remark: string
  uPL: string
  defId: number
  seqId: number
  status: ApparatusEntityStatus
  lineName: string
  workcellId: number
  location: string
  picture: Array<number>
  regDate: string
  apparatusEntityId: number
  id: number
  inHandlingPerson: string
  inRecordPerson: string
  inTime: string
  lineId: number
  outHandlingPerson: string
  outRecordPerson: string
  outTime: string
}

export default storeTemp('ioRecord', { allData: allIoRecords }, { createOne, updateOne, deleteOne }, {
  getters: {
    processedIoRecordData: (state: State<IoRecordData>) => {
      const ret = <Array<ProcessedIoRecordData>>[]
      state.data.forEach((ioRecordData, i) => {
        const { apparatusEntity, line, ...otherData } = ioRecordData


        const { def, ...data } = apparatusEntity
        const { family, name, ...otherDefData } = def
        ret.push({
          familyName: family.name,
          apparatusDefName: name,
          ...otherDefData,
          ...data,
          lineName: line.name,
          workcellId: line.workcellId,
          ...otherData
        })
      })
      return ret
    },
  }
})
