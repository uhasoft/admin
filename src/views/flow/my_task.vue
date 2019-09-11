<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表格-->
        <el-table v-loading="loading" :data="tasks" border style="width: 100%" stripe>
          <el-table-column width="100" prop="id" label="ID#"/>
          <el-table-column width="150" prop="flowName" label="流程名"/>
          <el-table-column prop="name" label="任务名"/>
          <el-table-column width="200" prop="createTime" label="任务开始时间"/>
          <el-table-column label="操作"  fixed="right" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="$router.push('flow/task/' + scope.row.id + '/closure')">完成任务</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        loading: true,
        total: 1,
        pageSize: 10,  // 一页显示几条数据
        page: 0,
        currentPage: this.$store.state.currentPage,
        tasks: []
      }
    },
    created () {
      const self = this;
      self.$api.get('/flow/task', null, r=>{
        self.tasks = r.data;
        self.loading = false;
      });
    },
    methods: {
      handleTableOperation(operation){
        const self = this;
        if(operation.confirmRequired){
          self.$confirm('确认执行该操作吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'cancel'
          }).then(() => {
            if(operation.httpMethod){
              if(!self.selectedIds.get('ids') || self.selectedIds.get('ids').length === 0){
                alert("请先勾选需要操作的记录！");
              } else {
                self.doHttp(operation.httpMethod, operation.url, function () {
                  self.refreshTable();
                }, self.selectedIds);
              }
            } else {
              self.$router.push(operation.url);
            }
          }).catch((e) => {
            console.error(e)
          });
        } else if(operation.url){
          self.$router.push(operation.url);
        }
      },
      handle(taskId){
        const self = this;
        if(operation.confirmRequired){
          self.$confirm('确认执行该操作吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'cancel'
          }).then(() => {
            if(operation.httpMethod){
              self.doHttp(operation.httpMethod, operation.url, function () {
                self.refreshTable();
              });
            } else {
              self.$router.push(operation.url);
            }
          }).catch(() => {
          });
        } else if(operation.url){
          self.$router.push(operation.url);
        }
      },
      doHttp(method, url, callback, data) {
        const self = this;
        self.$api[method.toLowerCase()](url, data, r=>{
          if(r.code === 0){
            self.$message({
              message:'操作成功！',
              type:'success'
            });
            if(callback){
              callback();
            }
          }else{
            alert(r.message);
          }
        })
      },
      handleSizeChange(val) {     // 一页显示几条数据
        const self = this;
        if(self.pageSize != val){
          self.pageSize = val;
          localStorage[self.entity] = JSON.stringify({
            pageSize: self.pageSize,
            page: self.page
          });
          self.refreshTable();
        }
      },
      handleCurrentChange(val) {      // 当前第几页
        const self = this;
        if(self.page != val - 1){
          self.page = val - 1;
          localStorage[self.entity] = JSON.stringify({
            pageSize: self.pageSize,
            page: self.page
          });
          self.refreshTable();
        }
      }
    }
  };
</script>
<style>
  .el-pagination {
    text-align: center;
    margin-top: 30px;
  }
  /*.el-message-box__btns .cancel {*/
  /*float: right;*/
  /*margin-left: 10px;*/
  /*}*/
  /*title*/
  .title{
    border-bottom: 1.5px solid #aaa;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  /*!*修改样式*!*/
  .el-table .cell, .el-table th>div{
    padding-left: 10px!important;
    padding-right: 10px;
    font-size:12.5px;
  }
  .el-button--small, .el-button--small.is-round{
    padding: 9px 12px;
  }
</style>
