import {FamilyData} from './family'
import {ApparatusEntityData} from './apparatusEntity'
import {State} from '../util/helper'
import { storeTemp } from '@/util/helper'
import allApparatusEntities from '@/apollo/queries/allApparatusEntities.gql' // TODO change
import createOne from '@/apollo/mutations/apparatusDef/createOne.gql'
import updateOne from '@/apollo/mutations/apparatusDef/updateOne.gql'
import deleteOne from '@/apollo/mutations/apparatusDef/deleteOne.gql'

export interface ApparatusDefData {
  code: string
  family: FamilyData
  id: number
  models: string
  name: string
  owner: string
  partNos: string
  pMPeriod: number
  recBy: string
  recOn: string
  remark: string
  uPL: string
}


export default storeTemp('apparatusDef', { allData: allApparatusEntities }, { createOne, updateOne }, {

})
