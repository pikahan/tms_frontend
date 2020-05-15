// @ts-ignore
import allLines from '@/apollo/queries/allLines.gql'
import createOne from '@/apollo/mutations/family/createOne.gql'
import updateOne from '@/apollo/mutations/family/updateOne.gql'
import deleteOne from '@/apollo/mutations/family/deleteOne.gql'

import { storeTemp } from '@/util/helper'


// export interface FamilyCreateQuery {
//   name: string
// }
//
// export interface FamilyData {
//   id: number
//   name: string
// }

export default storeTemp('line', { allData: allLines }, { createOne, updateOne, deleteOne })
