// @ts-ignore
import allParNos from '@/apollo/queries/allPartNos.gql'
import { storeTemp } from '@/util/helper'

// @ts-ignore
export default storeTemp('partNo', { allData: allParNos })
