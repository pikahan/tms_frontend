// @ts-ignore
import allModels from '@/apollo/queries/allModels.gql'
import createOne from '@/apollo/mutations/model/createOne.gql'
import updateOne from '@/apollo/mutations/model/updateOne.gql'
import deleteOne from '@/apollo/mutations/model/deleteOne.gql'
import { storeTemp } from '@/util/helper'

interface ModelCreateInput {
  name: string
  familyId: number
}

export interface ModelCreateQuery {
  input: ModelCreateInput
}

// @ts-ignore
export default storeTemp('model', { allData: allModels }, { createOne, updateOne, deleteOne })
