<template>
  <div class="welcome">
    <a-avatar :size="80" icon="user" />
    <div class="welcome-content">
      <p class="welcome-content-title">{{ greet }}</p>
      <p class="welcome-content-info">{{ info }}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'welcome',
    props: {
      name: {
        type: String,
        default: '匿名'
      },
      info: {
        type: String,
        default: '暂无新消息'
      }
    },



    computed: {
      greet() {
        const name = this.name
        const hour = (new Date).getHours()
        if(hour < 6) { return `凌晨了, 注意休息  ${name}  。`}
        else if (hour < 9) { return `早上好, ${name} , 祝你开心每一天!` }
        else if (hour < 12) { return `上午好,  ${name} , 祝你开心每一天!` }
        else if (hour < 14) { return `中午好,  ${name} , 祝你开心每一天!` }
        else if (hour < 17) { return `下午好,  ${name} , 祝你开心每一天!` }
        else if (hour < 19) { return `傍晚好,  ${name} , 注意休息!` }
        else if (hour < 22) { return `晚上好,  ${name} , 注意休息!` }
        else { return `晚深了,  ${name} , 注意休息!` }
      }
    }
  }
</script>

<style scoped>
  .welcome {
    display: flex;
    justify-content: left;
    margin-bottom: 40px;
  }

  .welcome-content {
    padding-top: 16px;
    margin-left: 20px;

  }

  .welcome-content-title {
    margin-bottom: 6px;
    font-weight: bold;
    font-size: 20px;
    color: black;
  }
</style>
