<template>
  <a-carousel ref="initial" :dots="false">
    <div style="margin-top: 300px">
      <a-row>
        <a-col :md="{span: 8, offset:8}" :xs="{span: 16, offset: 4}">
          <a-input v-model="workCellName" placeholder="请输入新的WorkCell名称" class="intial-input" />
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="2" offset="8">
          <a-button type="dashed">
            <nuxt-link to="/">取消</nuxt-link>
          </a-button>
        </a-col>
        <a-col span="2" offset="4">
          <a-button type="primary" @click="next()" :disabled="isWDisabled">下一步</a-button>
        </a-col>
      </a-row>
    </div>
    <div style="margin-top: 200px">
      <a-row>
        <a-col :md="{span: 8, offset:8}" :xs="{span: 16, offset: 4}">
          <a-form-item>
            <a-input v-model="employeeId" placeholder="请输入管理员的工号" class="intial-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="{span: 8, offset:8}" :xs="{span: 16, offset: 4}">
          <a-form-item>
            <a-input v-model="mail" placeholder="请输入管理员的邮箱" class="intial-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="{span: 8, offset:8}" :xs="{span: 16, offset: 4}">
          <a-form-item>
            <a-input-password
              type="password"
              v-model="password"
              placeholder="请输入管理员的密码"
              class="intial-input"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col :xs="{span: 2, offset:4}" :md="{span: 2, offset:8}">
          <a-button type="dashed">
            <nuxt-link to="/">取消</nuxt-link>
          </a-button>
        </a-col>
        <a-col :xs="{span: 2, offset:3}" :md="{span: 2, offset:0}">
          <a-button type="primary" @click="prev()">上一步</a-button>
        </a-col>
        <a-col :xs="{span: 2, offset:4}" :md="{span: 2, offset:0}">
          <a-button type="primary" @click="createNew" :disabled="isCDisabled">确认创建</a-button>
        </a-col>
      </a-row>
    </div>
  </a-carousel>
</template>
<script>
import gql from "@/apollo/mutations/initial.gql";
export default {
  data() {
    return {
      workCellName: "",
      employeeId: "",
      mail: "",
      password: ""
    };
  },
  methods: {
    next() {
      this.$refs.initial.next();
    },
    prev() {
      this.$refs.initial.prev();
    },
    createNew() {
      const data = this.$apolloProvider.defaultClient
        .mutate({
          mutation: gql,
          variables: {
            workCellName: this.workCellName,
            employeeId: this.employeeId,
            mail: this.mail,
            password: this.password
          }
        })
        .then(({ data }) => {
          console.log(data);
          this.$message.success("创建成功");
          this.$router.push('/login');
        })
        .catch(e => {
          console.error(e);
        });
    }
  },
  computed: {
    isWDisabled() {
      if (this.workCellName.trim() !== "") {
        return false;
      }
      return true;
    },
    isCDisabled() {
      if (
        this.employeeId.trim() !== "" &&
        this.password.trim() !== "" &&
        this.mail.trim() !== ""
      ) {
        return false;
      }
      return true;
    }
  }
};
</script>
<style scoped>
.ant-carousel {
  width: 100%;
  height: 100%;
  background: #364d79;
}
.ant-carousel >>> .slick-slide {
  overflow: hidden;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}
.initial-input {
  padding: 0 5em;
}
</style>
