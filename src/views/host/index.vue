<template>
  <div>
    <div style="width:18%;margin-top:4px">
      <el-tree
        :data="data"
        show-checkbox
        :props="defaultProps"
        empty-text="未命名"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [{
        label: '所有节点',
        children: [{
          label: '集群1',
          children: [{
            label: '192.168.100.111'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="sass">
</style>
