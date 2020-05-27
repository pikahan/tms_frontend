import {UserCreateQuery, UserUpdateQuery} from '../store/user'
import {FamilyCreateQuery} from '../store/family'
import {ModelCreateQuery} from '../store/model'
import {PartNoCreateQuery} from '../store/partNo'
import Message from 'ant-design-vue/lib/message';


interface StoreTempOptions {
  state?: object
  mutations?: object
  getters?: object
  actions?: object
  queryVariables?: object
}

interface GQLQuery {
  allData: object
  datum?: object
}


interface GQLMutation {
  createOne?: Object
  updateOne?: Object
  deleteOne?: Object
  deleteAll?: Object
  create?: Object
  update?: Object
}

interface StateData {
  id: number | string
}

export interface State<T> {
  data: T[]
  [propName: string]: any
}

type CreateDataOption = UserCreateQuery | FamilyCreateQuery | ModelCreateQuery | PartNoCreateQuery

type UpdateDataQuery = UserUpdateQuery

interface UpdateDataOption<T>{
  id: number
  data: T
  index: number
}

const defaultOptions: StoreTempOptions = { state: {}, mutations: {}, getters: {}, actions: {}, queryVariables: {} }



export const storeTemp = <T extends StateData>(dataName: string, query: GQLQuery, mutation: (GQLMutation | null) = null, options=defaultOptions) => {

  const findIdByState = (currState: State<T>, index: number) => {
    console.log('findIdByState index: ' + index)
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
    async fetchData({ commit }: any, option: any) {
      let client = (this as any).app.apolloProvider.defaultClient
      try {
        const { data } = await client.query({
          query: query.allData,
          fetchPolicy: 'network-only',
          ...option
        })
        const allDataName = dataName.endsWith('y') ? dataName.substr(0, dataName.length-1) + 'ies' : dataName + 's';
        commit('setData', data[allDataName].payload)
        console.log('fetch data')
        console.log(data)
      } catch (e) {
        console.error(e)


      }
    },
    async createData({ commit }: any, option: CreateDataOption) {
      if (mutation === null) {
        console.error('no mutation')
        return
      }
      console.log(Message)
      await Message.loading({ content: '请等待...', key: 'key' });

      let client = (this as any).app.apolloProvider.defaultClient
      console.log(option)
      try {
        let { data } = await client.mutate({
          mutation: mutation.createOne,
          variables: { input: option }
        })
        console.log(data)
        Message.success({ content: '更新', key: 'key' });
      } catch (e) {

        Message.error({ content: '创建失败', key: 'key' });
      }
      // TODO 错误处理

    },
    async createMultipleData({ commit }: any, option: CreateDataOption) {
      if (mutation === null) {
        console.error('no mutation')
        return
      }
      let client = (this as any).app.apolloProvider.defaultClient
      console.log(option)
      try {

        let { data } = await client.mutate({
          mutation: mutation.create,
          variables: { input: option }
        })
      } catch (e) {
        console.error(e)
      }
      // TODO 错误处理

    },
    async updateMultipleData({ commit }: any, option: UpdateDataOption<UpdateDataQuery>) {
      if (mutation === null) {
        console.error('no mutation')
        return
      }
      let client = (this as any).app.apolloProvider.defaultClient
      console.log(option)
      try {

        let { data } = await client.mutate({
          mutation: mutation.update,
          variables: { input: option }
        })
      } catch (e) {
        console.error(e)
      }
      // TODO 错误处理

    },
    async updateData({ commit, state }: any, option: UpdateDataOption<UpdateDataQuery>) {
      if (mutation === null) {
        return
      }
      const id = typeof option.id !== 'undefined' ? option.id*1 : findIdByState(state, option.index)
      let client = (this as any).app.apolloProvider.defaultClient

      try {
        console.log('update args')
        console.log(typeof option.data !== 'undefined' ? {id, ...option.data } : option)
        let { data } = await client.mutate({
          mutation: mutation.updateOne,
          variables: { input: typeof option.data !== 'undefined' ? {id, ...option.data } : option}
        })
        console.log('update ok')
        console.log('the variables start')

        console.log({ input: typeof option.data !== 'undefined' ? {id, ...option.data } : option})
        console.log('the variables end')

      } catch (e) {
        console.log(e, 'update error')
      }
      // TODO 改变数据
      // commit('addData, data')
    },
    async deleteData({ commit, state }: any, option: any) {
      if (mutation === null) {
        return
      }
      const id = findIdByState(state, option.index)
      let client = (this as any).app.apolloProvider.defaultClient
      try {

        await Message.loading({ content: '请等待...', key: 'key' });
        let { data } = await client.mutate({
          mutation: mutation.deleteOne,
          variables: { input: typeof option.data === 'undefined' ? id : {id, ...option.data }}
        })
        const allDataName = dataName[0].toUpperCase() + dataName.slice(1, dataName.length)
        if (data['delete'+allDataName].success === false) {
          await Message.error({ content: '删除失败, 请检查是否删除了此类下所有的模组数据', key: 'key' });
        }
        // TODO 错误处理
        console.log('delete res', data)
      } catch (e) {
        console.log(e, 'delete error')
      }
    },

    async deleteAllData({ commit, state }: any, option: any) {
      if (mutation === null) {
        return
      }
      let client = (this as any).app.apolloProvider.defaultClient
      try {
        console.log(mutation.deleteAll)
        await Message.loading({ content: '请等待...', key: 'key' });
        let { data } = await client.mutate({
          mutation: mutation.deleteAll,
          variables: { input: option }
        })
        const allDataName = dataName[0].toUpperCase() + dataName.slice(1, dataName.length)
        if (data['delete'+allDataName + 's'].success === false) {
          await Message.error({ content: '删除失败, 请检查是否删除了此类下所有的模组数据', key: 'key' });
        }
        await Message.success({ content: '删除成功!', key: 'key' });

        console.log('delete res', data)
      } catch (e) {
        console.log(e, 'delete error')
      }
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
    console.log(ctx.$store.state[name].data.length)
    if (ctx.$store.state[name].data.length === 0 ) {
      console.log('fetch data start')
      let ret = await ctx.$store.dispatch(`${name}/fetchData`)
      console.log('fetch data end')
      return ret
    }
  }
}

export function arrayBufferToBase64(buffer: Array<number> ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

export function base64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = []

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
