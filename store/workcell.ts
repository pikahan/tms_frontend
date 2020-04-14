// @ts-ignore
import allWorkcells from '@/apollo/queries/allWorkcells.gql'
import { storeTemp } from '@/util/helper'

export interface Workcell {
  id: number
  name: string
}

export interface WorkcellData {
  id: number
  name: string
}

// @ts-ignore
export default storeTemp( 'workcell', { allData: allWorkcells })

