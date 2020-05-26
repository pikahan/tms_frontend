// @ts-ignore
import allRepairRecords from '@/apollo/queries/allRepairRecords.gql'
import createOne from '@/apollo/mutations/repairRecord/createOne.gql'
import updateOne from '@/apollo/mutations/repairRecord/updateOne.gql'
import deleteOne from '@/apollo/mutations/repairRecord/deleteOne.gql'
import { storeTemp } from '@/util/helper'
import {ApparatusEntityData} from './apparatusEntity'
import {State} from '../util/helper'

interface PartNoCreateInput {
  name: string
  modelId: number
}


export interface RepairRecordData {
  acceptor: string
  acceptorTime: string
  apparatusEntity: ApparatusEntityData
  apparatusEntityId: number
  applicationTime: string
  finishTime: string
  id: number
  picture: Array<number>
  proposer: string
  status: RepairStatus
}

interface ProcessedRepairRecordData extends RepairRecordData {
  code: string
  key: number

}

export type RepairStatus = '在库'| '线上' | '临时领出' | '维修' | '报废'

export default storeTemp('repairRecord', { allData: allRepairRecords }, { createOne, updateOne, deleteOne }, {
  getters: {
    processedRepairRecordData: (state: State<RepairRecordData>) => {
      const ret = <Array<ProcessedRepairRecordData>>[]
      state.data.forEach((repairRecordData, i) => {
        const { apparatusEntity, id: key} = repairRecordData
        const { id: defId, code } = apparatusEntity.def
        ret.push({
          code,
          ...repairRecordData,
          key
        })
      })
      return ret.sort((a, b) => {
        let states = ['申请中']
        let aStatus = states.indexOf(a.status)
        let bStatus = states.indexOf(b.status)
        return -aStatus + bStatus
      })
    },
  }
})
