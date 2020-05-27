<template>
    <div class="list-wrapper">
      <div class="list">
        <h2 class="list-title">申请中</h2>
        <a-list item-layout="horizontal" :data-source="inApplicationListItem">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <a slot="title" href="javascript:void(0)" class="description-title">{{ item.title }}</a>
              <div slot="description" class="column-wrapper">
                <div class="left-column">
                  <p>夹具: {{item.apparatusName}}</p>
                  <p style="margin-top: 62px">申请时间: {{item.applicationTime}}</p>
                </div>
                <div class="right-column">
                  <p>当前状态</p>
                  <a-timeline>
                    <a-timeline-item v-for="(statusDatum, i) of item.statusData" :color="i === item.statusData.length - 1 ? 'blue' : 'grey'">
                      <p>{{`${statusDatum.status}${statusDatum.operator ? ', 操作人: ' + statusDatum.operator : ''}`}}</p>
                    </a-timeline-item>
                  </a-timeline>
                </div>
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
      <div class="list">
        <h2 class="list-title">被拒绝申请</h2>
        <a-list item-layout="horizontal" :data-source="refusedListItem">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <a slot="title" href="javascript:void(0)" class="description-title">{{ item.title }}</a>
              <div slot="description" class="column-wrapper">
                <div class="left-column">
                  <p>夹具: {{item.apparatusName}}</p>
                  <p style="margin-top: 62px">申请时间: {{item.applicationTime}}</p>
                </div>
                <div class="right-column">
                  <p>当前状态</p>
                  <a-timeline>
                    <a-timeline-item v-for="(statusDatum, i) of item.statusData" :color="i === item.statusData.length - 1 ? 'blue' : 'grey'">
                      <p>{{`${statusDatum.status}${statusDatum.operator ? ', 操作人: ' + statusDatum.operator : ''}`}}</p>
                    </a-timeline-item>
                  </a-timeline>
                </div>
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
      <div class="list">
        <h2 class="list-title">已通过申请</h2>
        <a-list item-layout="horizontal" :data-source="passedListItem">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <a slot="title" href="javascript:void(0)" class="description-title">{{ item.title }}</a>
              <div slot="description" class="column-wrapper">
                <div class="left-column">
                  <p>夹具: {{item.apparatusName}}</p>
                  <p style="margin-top: 62px">申请时间: {{item.applicationTime}}</p>
                </div>
                <div class="right-column">
                  <p>当前状态</p>
                  <a-timeline>
                    <a-timeline-item v-for="(statusDatum, i) of item.statusData" :color="i === item.statusData.length - 1 ? 'blue' : 'grey'">
                      <p>{{`${statusDatum.status}${statusDatum.operator ? ', 操作人: ' + statusDatum.operator : ''}`}}</p>
                    </a-timeline-item>
                  </a-timeline>
                </div>
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </div>
</template>

<script>
  import query from '@/apollo/queries/applicationQuery.gql'

  export default {
    name: 'application',
    data() {
      return {
        inApplicationListItem: [
          {
            title: '报废申请',
            apparatusName: 'testName',
            applicationTime: '2019年12月11日',
            statusData: [
              { status: '初审通过', operator: 'admin' }
            ]
          }
        ],
        passedListItem: [],
        refusedListItem: []
      }
    },
    created() {
      let getDefName = record => {
        return record.apparatusEntity.def.name
      }

      let proposer = this.$store.state.user.userInfo.employeeId
       this.$apolloProvider.defaultClient.query({
        query: query,
        variables: { proposer }
      }).then(({data}) => {
        console.log(data)
         let inApplicationListItem = []
         let passedListItem = []
         let refusedListItem = []

         data.repairRecords.payload.forEach(item => {
           let apparatusName = getDefName(item)
           let { acceptor, acceptorTime, applicationTime, id, status } = item

           let listItemData = {
             title: '报修申请',
             apparatusName,
             applicationTime
           }

           switch (status) {
             case '拒绝申请':
               refusedListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '拒绝申请', operator: acceptor }
                 ]
               }))
               break
             case '申请中':
               inApplicationListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '申请中' }
                 ]
               }))
               break
             case '维修中':
             case '未修复':
             case '已修复':
               passedListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '请求被批准', operator: acceptor },
                   { status },
                 ]
               }))
               break
           }

         })
         data.scrapRecords.payload.forEach(item => {
           let apparatusName = getDefName(item)
           let { middleProcessor, applicationTime, finalProcessor,  id, status } = item

           let listItemData = {
             title: '报废申请',
             apparatusName,
             applicationTime
           }

           switch (status) {
             case '申请中':
               inApplicationListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '申请中' }
                 ]
               }))
               break
             case '初审通过':
               inApplicationListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '初审通过', operator: middleProcessor }
                 ]
               }))
               break
             case '初审拒绝':
               refusedListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '初审拒绝', operator: middleProcessor }
                 ]
               }))
               break
             case '终审通过':
               passedListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '初审通过', operator: middleProcessor },
                   { status: '终审通过', operator: finalProcessor },
                 ]
               }))
             case '终审拒绝':
               refusedListItem.push(Object.assign(listItemData, {
                 statusData: [
                   { status: '初审通过', operator: middleProcessor },
                   { status: '终审拒绝', operator: finalProcessor }
                 ]
               }))
           }
         })

         const timeSorter = (a, b) => {
          return a.applicationTime < b.applicationTime ? 1 : -1
         }

         this.inApplicationListItem = inApplicationListItem.sort(timeSorter)
         this.passedListItem = passedListItem.sort(timeSorter)
         this.refusedListItem = refusedListItem.sort(timeSorter)
       })


    }
  }
</script>

<style scoped>
  .list {
    margin-bottom: 30px;
  }

  .column-wrapper {
    display: flex;
    flex-direction: row;
    padding-top: 10px;
    padding-left: 10px;
  }
  .list-title {
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }

  .description-title {
    padding-left: 10px;
  }

  .left-column {
    flex: 1;
  }

  .right-column {
    flex: 1;
  }
</style>
