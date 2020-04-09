interface StoreTempOptions {
  state?: object
  mutations?: object
  getters?: object
  actions?: object
}

interface GQLQuery {
  allData: object
  datum: object
}

interface GQLMutation {
  createOne: Object
}

export interface State<T> {
  data: T[]
  [propName: string]: any
}

interface CreateDataOption {
  index: number
}

const defaultOptions: StoreTempOptions = { state: {}, mutations: {}, getters: {}, actions: {} }

export const storeTemp = (dataName: string, query: GQLQuery, mutation: GQLMutation | null, options=defaultOptions) => {

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
      let { index, ...opt } = option
      let { data } = await client.mutation({
        mutation: mutation.createOne,
        variables: opt
      })

      if (data.success) {
        let { data: datum } = await client.query({
          query: query.datum
        })

        commit('addData', datum[dataName])
      }

      // TODO 错误处理

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
