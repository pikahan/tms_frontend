// @ts-ignore
import allParNos from '@/apollo/queries/allPartNos.gql'
import createOne from '@/apollo/mutations/partNo/createOne.gql'
import updateOne from '@/apollo/mutations/partNo/updateOne.gql'
import deleteOne from '@/apollo/mutations/partNo/deleteOne.gql'
import { storeTemp } from '@/util/helper'

interface PartNoCreateInput {
  name: string
  modelId: number
}

export interface PartNoCreateQuery {
  input: PartNoCreateInput
}

export default storeTemp('partNo', { allData: allParNos }, { createOne, updateOne, deleteOne })
