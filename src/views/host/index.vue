<template>
  <div style="height:100%">
    <div class="dataBaseTree">
      <el-tree
        ref="treeData"
        :data="treeData"
        :default-expanded-keys="x"
        show-checkbox
        :props="defaultProps"
        highlight-current
        node-key="id"
        render-after-expand
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script>
import { hostGroupList, hostNameList } from '@/api/host'

export default {
  data() {
    return {
      x: [1],
      treeData: [{
        id: 1,
        label: '总集群',
        children: []
      }],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      }
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      hostGroupList({
      }).then(response => {
        var groupData = response.data
        var t = 0
        var l = 1
        for (var i = 1; i <= groupData.length; i++) {
          var hostsData = []
          hostNameList({ 'hostGroupName': groupData[i - 1].hostGroupName }).then(res => {
            var hostData = res.data
            l = res.data.length
            for (var j = 0; j < hostData.length; j++) {
              var tmpHost = { id: i + 1 + j + 1, label: hostData[j].customName }
              hostsData.push(tmpHost)
            }
          })
          t = i + l
          var tmpGroup = { id: t, label: groupData[i - 1].hostGroupName, children: hostsData }
          this.treeData[0].children.push(tmpGroup)
          console.log(this.treeData)
        }
      })
    },
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
<style>
.dataBaseTree{
       width:230px;
       height:1000px;
       margin-top: 0px;
       border:1px solid #f3f0f0; }
</style>
