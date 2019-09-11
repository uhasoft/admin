<template>
  <section>
    <el-row>
      <el-col :span="24">

        <el-form v-if="filterFields.length > 0" :inline="true" :model="filterMap" class="demo-form-inline">
          <el-form-item v-for="f in filterFields" :label="f.name" v-bind:key="f.id">
            <el-input v-if="f.filterType == 'Text'" v-model="filterMap[f.property]"></el-input>
            <el-select v-if="f.filterType == 'Select'" v-model="filterMap[f.property]" clearable="">
              <el-option v-for="item in filterOptions[f.property]" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="refreshTable">查询</el-button>
        </el-form>
        <el-row>
          <a v-for="op in operations" v-bind:key="op.id" class="el-button el-button--primary el-button--small" :href="'#' + op.url">{{op.name}}</a>
          <!--<el-button v-for="op in operations" :type="op.style" size="mini" @click="handleTableOperation(op)">{{op.name}}</el-button>-->
        </el-row>
        <!--表格-->
        <el-table v-loading="loading" :data="records" border style="width: 100%" @selection-change="handleSelectionChange" stripe>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column v-for="column in columns" v-bind:key="column.id" v-if="onlyOneVisible && column.visible"
                           :prop="column.alias + '_' + column.columnName" :label="column.name">
          </el-table-column>
          <el-table-column v-for="column in columns" v-bind:key="column.id" v-if="!onlyOneVisible && column.visible" :width="column.width"
                           :prop="column.alias + '_' + column.columnName" :label="column.name">
          </el-table-column>
          <el-table-column label="操作"  fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-for="eop in entityOperations[scope.row[idColumn]]" v-bind:key="eop.id" :type="eop.style" size="mini" @click="handle(eop)">{{eop.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total,sizes,prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        entity: '',
        listUrl: '',
        records: [],
        loading: true,
        total: 1,
        pageSize: 10,  // 一页显示几条数据
        page: 0,
        currentPage: this.$store.state.currentPage,
        select: this.$store.state.select,
        entityOperations: {},
        columns: [],
        idColumn: 'id',
        operations: [],
        filterMap:{},
        filterFields: [],
        filterOptions:{

        },
        selectedIds: new FormData(),
        onlyOneVisible: false
      }
    },
    created () {
      const self = this;
      self.entity = self.$route.path.substr(1);
      self.listUrl = '/' + self.entity + '/filter';
      if (localStorage[self.entity]) {
        // 如果本地存储中存在分页信息，使用本地存储中的值
        const pageInfo = JSON.parse(localStorage[self.entity]);
        self.pageSize = pageInfo.pageSize;
      }
      self.$api.get('/filter_field/alias/' + self.entity, null, r=>{
        self.filterFields = r.data;
        for(let i = 0; i < self.filterFields.length; i++){
          if(self.filterFields[i].filterType === 'Select'){
            self.$api.get(self.filterFields[i].dataSource, null, resp=>{
              self.$set(self.filterOptions, self.filterFields[i].property, resp.data);
            });
          }
          self.loading = false;
        }
        self.loading = false;
      });
      self.$api.get('/operation/entity/' + self.entity, null,r=>{
        self.operations = r.data;
        self.loading = false;
      });
      self.refreshTable();
    },
    watch: {
      '$route'(to, from){

      }
    },
    methods: {
      refreshTable(){
        const self = this;
        self.loading = true;
        self.$api.post(self.listUrl + "?pageNum=" + self.page + "&pageSize=" + self.pageSize, self.filterMap, resp =>{
          self.total = resp.data.total;
          self.records = resp.data.content;
          self.pageSize = resp.data.size;
          self.columns = resp.data.columns;
          let visibleColumns = 0;
          for(let i = 0; i < resp.data.columns.length; i++){
            if(resp.data.columns[i].visible){
              visibleColumns++;
            }
          }
          if(visibleColumns === 1){
            self.onlyOneVisible = true;
          }
          self.idColumn = resp.data.idColumn;
          for(let i = 0; i < resp.data.content.length; i++){
            let id = resp.data.content[i][resp.data.idColumn];
            self.$api.get('/operation/entity/' + self.entity + '/id/' + id, null, ops=>{
              self.$set(self.entityOperations, id, ops.data);
            });
          }
          self.loading = false;
        });
      },
      handleSelectionChange(selections){
        this.selectedIds.delete('ids');
        const ids = [];
        for(let i = 0; i < selections.length; i++){
          ids.push(selections[i][this.idColumn]);
        }
        this.selectedIds.append('ids', ids);
        console.log(this.selectedIds.get('ids'));
      },
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
      handle(operation){
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
        } else if(operation.httpMethod){
          self.doHttp(operation.httpMethod, operation.url, function () {
            self.refreshTable();
          });
        } else {
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
      },
      onSubmit () {
        const self = this;
        console.log(self.filterMap.url);
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
