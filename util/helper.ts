import {UserCreateQuery,UserUpdateQuery} from '../store/user'

interface StoreTempOptions {
  state?: object
  mutations?: object
  getters?: object
  actions?: object
}

interface GQLQuery {
  allData: object
  datum?: object
}


interface GQLMutation {
  createOne: Object
  updateOne: Object
}

interface StateData {
  id: number | string
}

export interface State<T> {
  data: T[]
  [propName: string]: any
}

type CreateDataOption = UserCreateQuery

type UpdateDataQuery = UserUpdateQuery

interface UpdateDataOption<T>{
  data: T
  index: number
}

const defaultOptions: StoreTempOptions = { state: {}, mutations: {}, getters: {}, actions: {} }



export const storeTemp = <T extends StateData>(dataName: string, query: GQLQuery, mutation: (GQLMutation | null) = null, options=defaultOptions) => {

  const findIdByState = (currState: State<T>, index: number) => {
    return currState.data[index].id
  }

  const state = () => ({
    data: [],
    ...options.state,
  })

  const mutations = {
    setData(state: State<any>, data: Array<any>) {
      state.data = data
    },
    addData(state: State<any>, data: Array<any>) {
      state.data = [...state.data, data]
    },
    ...options.mutations,
  }

  const getters = {
    ...options.getters
  }

  const actions = {
    async fetchData({ commit }: any) {
      let client = (this as any).app.apolloProvider.defaultClient
      const { data } = await client.query({
        query: query.allData
      })
      console.log(data, "fetch data")
      commit('setData', data[`${dataName}s`].payload)
    },
    async createData({ commit }: any, option: CreateDataOption) {
      if (mutation === null) {
        return
      }
      let client = (this as any).app.apolloProvider.defaultClient
      let { data } = await client.mutate({
        mutation: mutation.createOne,
        variables: option
      })

      if (data.success) {
        let { data: datum } = await client.query({
          query: query.datum
        })
        commit('addData', datum[dataName])
      }

      // TODO 错误处理

    },
    async updateData({ commit, state }: any, option: UpdateDataOption<UpdateDataQuery>) {
      if (mutation === null) {
        return
      }
      const id = findIdByState(state, option.index)
      let client = (this as any).app.apolloProvider.defaultClient

      try {
        console.log({ id, ...option.data }  )
        let { data } = await client.mutate({
          mutation: mutation.updateOne,
          variables: { input: {id, ...option.data }}
        })

      } catch (e) {
        console.log(e, 'update error')
      }
      // TODO 改变数据
      // commit('addData, data')
    },
    ...options.actions
  }

  return {
    state,
    mutations,
    getters,
    actions
  }
}

export function fetchDataIn(ctx: any) {
  return async (name: string) => {
    if (ctx.$store.state[name].data.length === 0 ) {
      return await ctx.$store.dispatch(`${name}/fetchData`)
    }
  }
}
