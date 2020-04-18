// @ts-ignore
import allModels from '@/apollo/queries/allModels.gql'
import { storeTemp } from '@/util/helper'

// @ts-ignore
export default storeTemp('model', { allData: allModels })
