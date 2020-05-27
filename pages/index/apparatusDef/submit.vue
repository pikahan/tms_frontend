<template>
  <application :formData="formData" :form="form" :rules="rules" :handleSubmit="handleSubmit"  goBackUrl="/apparatusDef">
    <template v-slot:first>
      <a-form-model-item  label="物品ID" prop="code" >
        <a-input
          v-model="form.code"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="名称" prop="name"  >
        <a-input
          placeholder="输入名称"
          v-model="form.name"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="点检周期" prop="pMPeriod"  >
        <a-input-number
          :min="1"
          :style="{width: '100%'}"
          placeholder="输入点检周期"
          v-model="form.pMPeriod"
        >
          <!--<a-icon slot="prefix" type="责任人" style="color: rgba(0,0,0,.25)" />-->
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item  label="产线配数" prop="uPL"  >
        <a-input-number
          :min="0"
          :style="{width: '100%'}"
          placeholder="输入产线配备数量"
          v-model="form.uPL"
        >
          <!--<a-icon slot="prefix" type="责任人" style="color: rgba(0,0,0,.25)" />-->
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item  label="workcell ID" prop="workcellId"  >
        <a-input
          :disabled="true"
          v-model="form.workcellId"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="录入人" prop="recBy"  >
        <a-input
          :disabled="true"
          v-model="form.recBy"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="责任人" prop="owner"  >
        <a-input
          v-model="form.owner"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
      <a-form-model-item  label="用途" prop="usedFor"  >
        <a-input
          v-model="form.usedFor"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>

      <a-form-model-item  label="备注" prop="remark"  >
        <a-input
          placeholder="输入备注"
          v-model="form.remark"
          type="textarea"
        >
          <!--<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />-->
        </a-input>
      </a-form-model-item>
    </template>
    <template v-slot:second>
      <!--<apparatus-type :partNoCallback="processType" />-->
      <a-form-model-item  label="大类" prop="family"  >
        <a-select
          show-search
          :value="form.family"
          placeholder="选择大类"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="fetchingFamilies ? undefined : null"
          @search="fetchFamilies"
          @change="handleFamiliesSelectorChange"
        >
          <a-spin v-if="fetchingFamilies" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in familiesSelectorData" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item  label="模组" prop="models"  >
        <a-select
          mode="multiple"
          label-in-value
          :value="form.models"
          placeholder="选择模组"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="fetchingModels ? undefined : null"
          @search="fetchModels"
          @change="handleModelsSelectorChange"
        >
          <a-spin v-if="fetchingModels" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in modelsSelectorData" :key="d.name">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item  label="料号" prop="partNos"  >
        <a-select
          mode="multiple"
          label-in-value
          :value="form.partNos"
          placeholder="选择料号"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="fetchingPartNos ? undefined : null"
          @search="fetchPartNos"
          @change="handlePartNosSelectorChange"
        >
          <a-spin v-if="fetchPartNos" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in partNosSelectorData" :key="d.name">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </template>
  </application>
</template>
<script>
  import application from '@/components/application'
  import ApparatusType from '@/components/apparatusType'
  import debounce from 'lodash/debounce';
  import familyGQL from '@/apollo/queries/allFamilies.gql'
  import modelGQL from '@/apollo/queries/allModels.gql'
  import partNoGQL from '@/apollo/queries/allPartNos.gql'




  // TODO 这个页面之后可能要重构, 先这么写了
  export default {

    components: {
      ApparatusType,
      application
    },
    data() {
      this.lastFetchIdForModel = 0;
      this.lastFetchIdForFamily = 0;
      this.lastFetchIdForPartNo = 0;


      this.fetchModels = debounce(this.fetchModels, 800)
      this.fetchFamilies = debounce(this.fetchFamilies, 800)

      return {
        form: {
          code: '',
          name: '',
          uPL: '',
          usedFor: '',
          pMPeriod: '',
          owner: '',
          // recOn: '',
          recBy: '',
          remark: '',
          workcellId: '',
          models: [],
          family: '',
          partNos: []
        },
        formData: [
          {
            title: '基础信息',
            modelItem: ['code', 'name', 'uPL', 'usedFor', 'pMPeriod', 'owner', 'recBy', 'remark']
          },
          {
            title: '夹具类别',
            modelItem: ['family', 'models', 'partNos']
          },
          {
            title: '成功提交申请'
          }
        ],
        rules: {
          code: [{ required: true, message: '请输入物品ID!' }],
          name: [{ required: true, message: '请输入物品名称!' }],
          uPL: [{ required: true, message: '请输入产线需要配备的数量!' }],
          userFor: [{ required: true, message: '请输入物品用途!' }],
          pMPeriod: [{ required: true, message: '请输入点检周期!' }],
          family: [{ required: true, message: '请选择大类!' }],
          models: [{ required: true, message: '请选择模组!' }],
          partNos: [{ required: true, message: '请选择料号!' }],
        },
        modelsSelectorData: [],
        familiesSelectorData: [],
        partNosSelectorData: [],
        fetchingModels: false,
        fetchingFamilies: false,
        fetchingPartNos: false,
      };
    },
    created() {
      console.log(this.$store.state.user.userInfo)
      const { workcellId, employeeId } = this.$store.state.user.userInfo
      this.form = {...this.form, workcellId, recBy: employeeId}
    },
    methods: {
      processType(familyData, modelData, partNoData) {
        console.log(familyData)
        this.typeData = {
          familyId: typeof familyData.id === 'undefined' ? null : familyData.id,
          models: typeof modelData.name  === 'undefined' ? null : modelData.name,
          partNos: typeof partNoData.name  === 'undefined' ? null : partNoData.name
        }
      },
      async handleSubmit(data, next) {
        console.log(data)

        let { models, partNos } = data

        models = models.map(model => model.key).join(' ')
        partNos = partNos.map(partNo => partNo.key).join(' ')

        let code = await this.$store.dispatch('apparatusDef/createData', {...data, recOn: (new Date).toISOString(), recBy: this.$store.state.user.userInfo.employeeId, models, partNos})
        console.log(code)
        next()
      },
      async fetchModels(value) {
        console.log('fetchModels', value);
        this.lastFetchIdForModel += 1;
        const fetchId = this.lastFetchIdForModel;
        this.modelsSelectorData = [];
        this.fetchingModels = true;


        try {

          console.log({ familyId: this.form.family, name: value  })

          let { data } = await this.$apolloProvider.defaultClient.query({
            query: modelGQL,
            variables: { familyId: this.form.family, name: value  }
          })

          if (fetchId !== this.lastFetchIdForModel) {
            // for fetch callback order
            return;
          }

          const receivedData = data.models.payload.map(modelData => {

            return {
              id: modelData.id,
              name: modelData.name
            }
          })

          console.log(receivedData)
          this.fetchingModels = false
          this.modelsSelectorData = receivedData
        } catch (e) {
          this.$message.error({content: '请先输入大类'})
        }
      },
      async fetchFamilies(value) {
        this.lastFetchIdForFamily += 1;
        const fetchId = this.lastFetchIdForFamily;
        this.modelsSelectorData = [];
        this.fetchingModels = true;


        let { data } = await this.$apolloProvider.defaultClient.query({
          query: familyGQL,
          variables: { name: value }
        })

        if (fetchId !== this.lastFetchIdForFamily) {
          // for fetch callback order
          return;
        }

        const receivedData = data.families.payload.map(familyData => {

          return {
            id: familyData.id,
            name: familyData.name
          }
        })

        console.log(receivedData)
        this.fetchingModels = false
        this.familiesSelectorData = receivedData
      },
      async fetchPartNos(value) {
        console.log('fetchPartNos', value);
        this.lastFetchIdForPartNo += 1;
        const fetchId = this.lastFetchIdForPartNo;
        this.partNosSelectorData = [];
        this.fetchingPartNos = true;

        // console.log({ name: value })
        let { data } = await this.$apolloProvider.defaultClient.query({
          query: partNoGQL,
          variables: { name: value }
        })

        if (fetchId !== this.lastFetchIdForPartNo) {
          // for fetch callback order
          return;
        }

        const receivedData = data.partNos.payload.map(partNoData => {

          return {
            id: partNoData.id,
            name: partNoData.name
          }
        })

        console.log(receivedData)
        this.fetchingPartNos = false
        this.partNosSelectorData = receivedData
      },


      handleModelsSelectorChange(value) {
        Object.assign(this, {
          form: { ...this.form, models: value },
          modelsSelectorData: [],
          fetchingModels: false,
        });
      },
      handleFamiliesSelectorChange(value) {
        Object.assign(this, {
          form: { ...this.form, family: value },
          FamiliesSelectorData: [],
          fetchingFamilies: false,
        });
      },
      handlePartNosSelectorChange(value) {
        Object.assign(this, {
          form: { ...this.form, partNos: value },
          partNosSelectorData: [],
          fetchingPartNos: false,
        });
      }
    }

  };
</script>
<style scoped>

</style>
