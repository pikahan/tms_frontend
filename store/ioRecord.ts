// @ts-ignore
import allIoRecords from '@/apollo/queries/allIoRecords.gql'
import createOne from '@/apollo/mutations/ioRecord/createOne.gql'
import updateOne from '@/apollo/mutations/ioRecord/updateOne.gql'
import deleteOne from '@/apollo/mutations/ioRecord/deleteOne.gql'

import { storeTemp } from '@/util/helper'


export interface FamilyCreateQuery {
  name: string
}

export interface FamilyData {
  id: number
  name: string
}

export default storeTemp('family', { allData: allIoRecords }, { createOne, updateOne, deleteOne })
