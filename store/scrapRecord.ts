// @ts-ignore
import allScrapRecords from '@/apollo/queries/allScrapRecords.gql'
import createOne from '@/apollo/mutations/scrapRecord/createOne.gql'
import updateOne from '@/apollo/mutations/scrapRecord/updateOne.gql'
import deleteOne from '@/apollo/mutations/scrapRecord/deleteOne.gql'
import { storeTemp } from '@/util/helper'
import {ApparatusEntityData} from './apparatusEntity'
import {State} from '../util/helper'

interface PartNoCreateInput {
  name: string
  modelId: number
}


export interface ScrapRecordData {
  id: number
  apparatusEntity: ApparatusEntityData
  apparatusEntityId: number
  reason: string
  proposer: string
  applicationTime: string
  middleProcessor: string
  middleProcessTime: string
  finalProcessor: string
  finalProcessTime: string
  status: ScrapStatus
}

interface ProcessedScrapRecordData extends ScrapRecordData {
  code: string
  key: number

}

export type ScrapStatus = '申请中' | '初审通过' | '初审拒绝' | '终审通过' | '终审拒绝'

export default storeTemp('scrapRecord', { allData: allScrapRecords }, { createOne, updateOne, deleteOne }, {
  getters: {
    processedScrapRecordData: (state: State<ScrapRecordData>) => {
      const ret = <Array<ProcessedScrapRecordData>>[]
      state.data.forEach((scrapRecordData, i) => {
        const { apparatusEntity, id: key} = scrapRecordData
        const { id: defId, code } = apparatusEntity.def

        ret.push({
          code,
          ...scrapRecordData,
          key
        })
      })
      return ret.sort((a, b) => {
        let states = ['申请中','初审通过']
        let aStatus = states.indexOf(a.status)
        let bStatus = states.indexOf(b.status)
        return -aStatus + bStatus
      })
    },
  }
})
