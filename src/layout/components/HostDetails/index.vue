<template>
  <div>
    <el-row>
      <div class="title">
        <span>{{ customName }}详情</span>
      </div>
    </el-row>
    <el-row>
      <el-col :span="6">
        <host-pic :custom-name="customName"></host-pic>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HostPic from './HostPic'

export default {
  name: 'HostDetails',
  components: {
    HostPic
  },
  data() {
    return {
      customName: 'AI一体机一号'
    }
  }
}
</script>
<style>
  .title {
    text-align:center;
    height:20px;
    margin-top: 10px;
  }
</style>
