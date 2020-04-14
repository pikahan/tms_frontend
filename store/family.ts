// @ts-ignore
import allFamilies from '@/apollo/queries/allFamilies.gql'
import { storeTemp } from '@/util/helper'

// @ts-ignore
export default storeTemp('family', { allData: allFamilies })
