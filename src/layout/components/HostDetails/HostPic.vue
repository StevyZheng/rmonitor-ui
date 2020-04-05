<template>
  <div>
    <el-card>
      <img :src="imgSrc" class="image">
      <div class="hostTitle">
        <span>{{ customName }}</span>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'HostPic',
  props: {
    imgSrc: {
      type: String,
      default: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
    },
    customName: {
      type: String,
      default: '主机X'
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style>
  .image {
    width: auto;
    display: block;
    background-repeat:no-repeat;
  }
  .hostTitle {
    text-align:center;
    margin-top: 10px;
  }
</style>
