// @ts-ignore
import allUserTypes from '@/apollo/queries/allUserTypes.gql'
import { storeTemp } from '@/util/helper'

// @ts-ignore
export default storeTemp('userType', { allData: allUserTypes })
