import {State} from '../util/helper'
import homeQuery from '@/apollo/queries/homeData.gql'
import {RepairStatus} from './repairRecord'
import {ScrapStatus} from './scrapRecord'


interface RepairRecord {
  id: number
  apparatusEntity: ApparatusEntity
  status: RepairStatus
  applicationTime: string
}

interface ScrapRecord {
  id: number
  apparatusEntity: ApparatusEntity
  applicationTime: string
  status: ScrapStatus

}

interface ApparatusEntity {
  def: { name: string }
}

export default {
  state: {
    repairRecords: [],
    scrapRecords: []
  },

  mutations: {
    setRepairRecords(state: State<any>, data: Array<any>) {
      state.repairRecords = data
    },
    setScrapRecords(state: State<any>, data: Array<any>) {
      state.scrapRecords = data
    },
  },
  getters: {
    processedRepairRecords(state: State<any>): any {
      let ret: any = []
      state.repairRecords.forEach((record: RepairRecord) => {
        const name = record.apparatusEntity.def.name
        ret.push({
          id: record.id,
          name,
          status: record.status,
          applicationTime: record.applicationTime
        })
      })
      return ret
    },
    processedScrapRecords(state: State<any>): any {
      let ret: any = []
      state.scrapRecords.forEach((record: ScrapRecord) => {
        const name = record.apparatusEntity.def.name
        ret.push({
          id: record.id,
          name,
          status: record.status,
          applicationTime: record.applicationTime
        })
      })
      return ret
    },  },
  actions: {
    async fetchData({ commit }: any, option: any) {
      let client = (this as any).app.apolloProvider.defaultClient

      try {
        const { data } = await client.query({
          query: homeQuery,
          fetchPolicy: 'network-only',
          ...option
        })
        console.log(data)
        commit('setRepairRecords', data.repairRecords.payload)
        commit('setScrapRecords', data.scrapRecords.payload)

      } catch (e) {
        console.error(e)
      }
    }
  }
}
