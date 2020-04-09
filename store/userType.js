import allUserTypes from '@/apollo/queries/allUserTypes.gql'
import { storeTemp } from '@/util/helper'

export default storeTemp('userType', { allData: allUserTypes })
