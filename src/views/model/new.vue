<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="110px" :rules="rules" :model="form">
      <el-form-item label="模型名(英文)" prop="name">
        <el-input v-model="form.name" style="width: 80%;"></el-input>
      </el-form-item><el-form-item label="模型名(中文)" prop="caption">
        <el-input v-model="form.caption" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="表名" prop="tableName">
        <el-input v-model="form.tableName" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="form.alias" style="width: 80%;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveModel('form')" v-loading="editLoading">保存</el-button>
      <el-button @click="handleCancel()">取消</el-button>
    </div>
    <el-tabs v-model="activeName" v-if="modelId" type="card" @tab-click="switchTab">
      <el-tab-pane label="模型字段" name="first">
        <el-row>
          <el-button v-for="op in fieldOperations" v-bind:key="op.id" :type="op.style" size="mini" @click="handleTableOperation(op)">{{op.name}}
          </el-button>
        </el-row>
        <el-table v-if="fields && fields.length > 0" v-loading="editLoading" :data="fields" border style="width: 100%" stripe>
          <el-table-column width="150" prop="name" label="字段名"/>
          <el-table-column width="150" prop="dataType" label="数据类型"/>
          <el-table-column prop="columnName" label="数据库字段名"/>
          <el-table-column prop="foreignFieldId" label="外键ID"/>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-for="eop in entityOperations[scope.row.id]" v-bind:key="eop.id" :type="eop.style" size="mini" @click="handle(eop)">{{eop.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="列表模板字段" name="second">
        <el-row>
          <el-button v-for="op in listTemplateFieldOperations" v-bind:key="op.id" :type="op.style" size="mini" @click="handleTableOperation(op)">{{op.name}}</el-button>
          <!--<el-button type="primary" size="mini" @click="$router.push('/list_template_field/model/'+modelId)">新建自身</el-button>-->
        </el-row>
        <el-table v-if="listTemplateFields && listTemplateFields.length > 0" v-loading="editLoading" :data="listTemplateFields" border style="width: 100%" stripe>
          <el-table-column width="100" prop="name" label="字段名"/>
          <el-table-column width="100" prop="visible" label="是否可见" :formatter="formatBool"/>
          <el-table-column prop="width" label="列宽"/>
          <el-table-column prop="sortIndex" label="排序位"/>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-for="eop in entityOperations[scope.row.id]" v-bind:key="eop.id" :type="eop.style" size="mini" @click="handle(eop)">{{eop.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="新建模板字段" name="third">
        <el-row>
          <el-button v-for="op in newFieldOperations" v-bind:key="op.id" :type="op.style" size="mini" @click="handleTableOperation(op)">{{op.name}}</el-button>
          <!--<el-button type="primary" size="mini" @click="$router.push('/new_field/model/'+modelId)">新建自身</el-button>-->
        </el-row>
        <el-table v-if="newFields && newFields.length > 0" v-loading="editLoading" :data="newFields" border style="width: 100%" stripe>
          <el-table-column width="200" prop="name" label="字段名"/>
          <el-table-column width="150" prop="columnName" label="数据库字段名"/>
          <el-table-column width="150" prop="fieldType" label="字段类型"/>
          <el-table-column prop="dataSource" label="数据来源"/>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-for="eop in entityOperations[scope.row.id]" v-bind:key="eop.id" :type="eop.style" size="mini" @click="handle(eop)">{{eop.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="过滤字段" name="fourth">
        <el-row>
          <el-button v-for="op in filterFieldOperations" v-bind:key="op.id" :type="op.style" size="mini" @click="handleTableOperation(op)">{{op.name}}</el-button>
          <!--<el-button type="primary" size="mini" @click="$router.push('/filter_field/model/'+modelId)">新建自身</el-button>-->
        </el-row>
        <el-table v-if="filterFields && filterFields.length > 0" v-loading="editLoading" :data="filterFields" border style="width: 100%" stripe>
          <el-table-column prop="name" label="模板字段"/>
          <el-table-column prop="filterType" label="字段类型" width="100" />
          <el-table-column prop="dataSource" label="数据来源"/>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-for="eop in entityOperations[scope.row.id]" v-bind:key="eop.id" :type="eop.style" size="mini" @click="handle(eop)">{{eop.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="操作" name="fifth">
        <el-row>
          <el-button v-for="op in operationOperations" v-bind:key="op.id" :type="op.style" size="mini" @click="handleTableOperation(op)">{{op.name}}</el-button>
          <!--<el-button type="primary" size="mini" @click="$router.push('/operation/model/'+modelId)">新建自身</el-button>-->
        </el-row>
        <el-table v-if="operationFields && operationFields.length > 0" v-loading="editLoading" :data="operationFields" border style="width: 100%" stripe>
          <el-table-column prop="name" label="模板字段" width="80" />
          <el-table-column prop="url" label="URL"/>
          <el-table-column prop="forEntity" label="记录操作？" :formatter="formatBool" width="100"/>
          <el-table-column prop="style" label="样式" width="80"/>
          <el-table-column prop="expression" label="使能表达式" width="100"/>
          <el-table-column prop="httpMethod" label="HttpMethod" width="100"/>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-for="eop in entityOperations[scope.row.id]" v-bind:key="eop.id" :type="eop.style" size="mini" @click="handle(eop)">{{eop.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="流程" name="sixth">
        <div v-if="!form.flowDefinitionId">
          <h4>该模型未设置流程定义</h4>
          <el-button type="primary" size="mini" @click="$router.push('/model/' + form.id + '/flow')">设置流程定义</el-button>
        </div>
        <div v-else >
          <h4 style="margin-bottom:20px">当前流程定义：{{flow.name}}</h4>
          <el-form ref="flowConfig" :label-position="labelPosition" label-width="110px" :model="flowConfig">
            <el-form-item label="模型ID" prop="modelId" hidden>
              <el-input v-model="flowConfig.modelId" ></el-input>
            </el-form-item>
            <el-form-item label="状态字段" prop="statusProp">
              <el-select v-model="flowConfig.statusProp">
                <el-option v-for="item in fields" v-bind:key="item.id" :key="item.propName" :label="item.name" :value="item.propName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始状态" prop="startStatus">
              <el-input v-model="flowConfig.startStatus" style="width: 80%;"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveFlowConfig('flowConfig')" v-loading="editLoading">保存</el-button>
            <el-button @click="handleCancel()">取消</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        modelId: '',
        labelPosition: 'left',
        editLoading: false,
        form: {},
        fieldOperations: [],
        listTemplateFieldOperations: [],
        newFieldOperations:[],
        filterFieldOperations:[],
        operationOperations: [],
        entityOperations: {},
        rules: {
          name: [
            {required: true, message: '请输入模型名(英文)', trigger: 'blur'}
          ],
          caption: [
            {required: true, message: '请输入模型名(中文)', trigger: 'blur'}
          ],
          tableName: [
            {required: true, message: '请输入表名', trigger: 'blur'}
          ],
          alias: [
            {required: true, message: '请输入别名', trigger: 'blur'}
          ]
        },
        fields: [],
        listTemplateFields: [],
        newFields: [],
        filterFields: [],
        operationFields: [],
        activeName: 'first',
        flow: {},
        flowConfig: {}
      }
    },
    created: function () {
      const self = this;
      self.modelId = self.$route.params.id;
      self.flowConfig.modelId = self.modelId;
      if (self.modelId) {
        self.$api.get('/model/' + self.modelId, null, r => {
          self.form = Object.assign({}, r.data);
          self.editLoading = false;
          self.refreshFlowDefinition(self.modelId);
        });
        self.refreshAll(self.modelId);
      }
    },
    methods: {
      refreshAll(modelId){
        this.refreshFields(modelId);
        this.refreshListTemplateFields(modelId);
        this.refreshNewFields(modelId);
        this.refreshFilterFields(modelId);
        this.refreshOperationFields(modelId);
      },
      refreshFields(modelId){
        const self = this;
        self.$api.get('/operation/entity/field', null, r => {
          self.fieldOperations = r.data;
        });
        self.$api.get('/field/model/' + modelId, null, r => {
          self.fields = r.data;
          for(let i = 0; i < self.fields.length; i++){
            self.$api.get('/operation/entity/field/id/' + self.fields[i].id, null, ops=>{
              self.$set(self.entityOperations, self.fields[i].id, ops.data);
            });
          }
        });
      },
      refreshListTemplateFields(modelId){
        const self = this;
        self.$api.get('/operation/entity/list_template_field', null, r => {
          self.listTemplateFieldOperations = r.data;
        });
        self.$api.get('/list_template_field/model/' + modelId, null, r => {
          self.listTemplateFields = r.data;
          for(let i = 0; i < self.listTemplateFields.length; i++){
            self.$api.get('/operation/entity/list_template_field/id/' + self.listTemplateFields[i].id, null, ops=>{
              self.$set(self.entityOperations, self.listTemplateFields[i].id, ops.data);
            });
          }
        });
      },
      refreshNewFields(modelId){
        const self = this;
        self.$api.get('/operation/entity/new_field', null, r => {
          self.newFieldOperations = r.data;
        });
        self.$api.get('/new_field/model/' + modelId, null, r=> {
          self.newFields = r.data;
          for(let i = 0; i < self.newFields.length; i++){
            self.$api.get('/operation/entity/new_field/id/' + self.newFields[i].id, null, ops=>{
              self.$set(self.entityOperations, self.newFields[i].id, ops.data);
            });
          }
        });
      },
      refreshFilterFields(modelId){
        const self = this;
        self.$api.get('/operation/entity/filter_field', null, r => {
          self.filterFieldOperations = r.data;
        });
        self.$api.get('/filter_field/model/' + modelId, null, r=> {
          self.filterFields = r.data;
          for(let i = 0; i < self.filterFields.length; i++){
            self.$api.get('/operation/entity/filter_field/id/' + self.filterFields[i].id, null, ops=>{
              self.$set(self.entityOperations, self.filterFields[i].id, ops.data);
            });
          }
        });
      },
      refreshOperationFields(modelId){
        const self = this;
        self.$api.get('/operation/entity/operation', null, r => {
          self.operationOperations = r.data;
        });
        self.$api.get('/operation/model/' + modelId, null, r=> {
          self.operationFields = r.data;
          for(let i = 0; i < self.operationFields.length; i++){
            self.$api.get('/operation/entity/operation/id/' + self.operationFields[i].id, null, ops=>{
              self.$set(self.entityOperations, self.operationFields[i].id, ops.data);
            });
          }
        });
      },
      refreshFlowDefinition(modelId){
        const self = this;
        if(self.form.flowDefinitionId){
          self.$api.get('/flow/' + self.form.flowDefinitionId, null, r=>{
            self.flow = r.data;
          });
          self.$api.get('/flow_config/model/' + modelId, null, r=>{
            if(r.data){
              self.flowConfig = r.data;
            }
          })
        }
      },
      saveModel (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid) => {
          if (valid) {
            this.editLoading = true;
            self.$api.post('/model', self.form, r => {
              this.$message({
                message: "操作成功！",
                type: 'success'
              });
              this.editLoading = false;
              this.$router.back();
            });
          }
        })
      },
      saveFlowConfig(config){
        const self = this;
        this.editLoading = true;
        self.$api.post('/flow_config', self.flowConfig, r => {
          this.$message({
            message: "操作成功！",
            type: 'success'
          });
          this.editLoading = false;
//          this.$router.back();
        });
      },
      handleTableOperation(operation){
        const self = this;
        if (operation.confirmRequired) {
          self.$confirm('确认执行该操作吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'cancel'
          }).then(() => {
            if (operation.httpMethod) {
              if (!self.selectedIds.get('ids') || self.selectedIds.get('ids').length === 0) {
                alert("请先勾选需要操作的记录！");
              } else {
                self.doHttp(operation.httpMethod, operation.url, function () {
                  self.$message({
                    message:'操作成功！',
                    type:'success'
                  });
                  self.refreshAll(self.modelId);
                }, self.selectedIds);
              }
            } else {
              self.$router.push(operation.url + '?modelId=' + self.form.id);
            }
          }).catch((e) => {
            console.error(e)
          });
        } else if (operation.url) {
          self.$router.push(operation.url + '?modelId=' + self.form.id);
//          self.$router.push(operation.url.replace(":modelId", self.form.id));
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
                self.$message({
                  message:'操作成功！',
                  type:'success'
                });
                self.refreshAll(self.modelId);
              });
            } else {
              self.$router.push(operation.url);
            }
          }).catch(() => {
          });
        } else if(operation.httpMethod){
          self.doHttp(operation.httpMethod, operation.url, function () {
            self.$message({
              message:'操作成功！',
              type:'success'
            });
            self.refreshAll(self.modelId);
          });
        } else {
          self.$router.push(operation.url);
        }
      },
      doHttp(method, url, callback, data) {
        const self = this;
        self.$api[method.toLowerCase()](url, data, r=>{
          self.$message({
            message:'操作成功！',
            type:'success'
          });
          if(callback){
            callback();
          }
        })
      },
      deleteField(id){
        const self = this;
        self.$confirm('确认执行该操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancel'
        }).then(() => {
          self.doHttp('delete', '/model/' + id, function () {
            self.refreshTable();
          });
        }).catch(() => {
        });
      },
      editField(id){
        const self = this;
        self.$router.push('/field/' + id + '/edit');
      },
      handleCancel(){    // 取消
        this.$router.back();
      },
      switchTab(tab, event) {
//        const self = this;
//        console.log(self.$refs);
        console.log(tab, event);
      },
      formatBool(row, column, cellValue){
        return cellValue ? "是" : "否";
      }
    }

  }
</script>
