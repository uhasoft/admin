<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="110px" :rules="rules" :model="form">
      <el-form-item label="字段" prop="fieldId">
        <el-cascader :options="fields" v-model="form.fieldId" :props="props"/>
      </el-form-item>
      <el-form-item label="字段名称" prop="name">
        <el-input v-model="form.name"  style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="字段类型" prop="dataType">
        <el-select v-model="form.dataType"  style="width: 70%;">
          <el-option v-for="item in dataTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="格式" prop="format">
        <el-input v-model="form.format" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="sortedNo">
        <el-input v-model="form.sortIndex" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="是否展示" prop="visible">
        <el-select v-model="form.visible">
          <el-option key="true" label="是" value="true"></el-option>
          <el-option key="false" label="否" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="列宽" prop="width">
        <el-input v-model="form.width" style="width: 80%;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('form')" v-loading="editLoading">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        labelPosition:'left',
        editLoading:false,
        form: {},
        fields:[],
        dataTypes:[],
        rules: {
          name: [
            { required: true, message: '请输入模型名称', trigger: 'blur' }
          ],
          dataType: [
            { required: true, message: '请输入数据类型', trigger: 'blur' }
          ],
          visible: [
            { required: true, message: '请是否展示', trigger: 'blur' }
          ],
          sortIndex: [
            { required: true, message: '请输入排序号', trigger: 'blur' }
          ],
          fieldId: [
            { required: true, message: '请选择字段', trigger: 'blur' }
          ]
        },
        props: {
          value: 'id',
          label: 'name',
          children: 'children'
        }
      }
    },
    created : function(){
      const self = this;
      self.id = self.$route.params.id;
      self.modelId = self.$route.params.modelId;
      if(!self.id && !self.modelId){
        self.$router.back();
      } else {
        if(self.id){
          self.$api.get('/list_template_field/' + self.id, null, r=>{
            const entity= Object.assign({},r.data);
            entity.fieldId = [entity.fieldId];
            self.form = Object.assign({},entity);
            self.form.visible = '' + self.form.visible;
            self.$api.get('/field/node/model/' + self.form.modelId, null, r=>{
              self.fields = r.data;
            });
          });
        } else if(self.modelId){
          self.form.modelId = self.modelId;
          self.$api.get('/field/node/model/' + self.modelId, null, r=>{
            self.fields = r.data;
          });
        }
        self.$api.get('/enum/DataType/all', null, r=>{
          self.dataTypes = r.data;
        });
      }
    },
    methods:{
      save (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid)=> {
          if (valid) {
            const entity = self.form;
            if(typeof self.form.fieldId === 'object'){
              entity.fieldId = entity.fieldId[entity.fieldId.length - 1];
            }
            this.editLoading = true;
            self.$api.post('/list_template_field', entity, r => {
              this.$message({
                message: "操作成功！",
                type: 'success'
              });
              this.editLoading = false;
              this.$router.back();
            });
          }
        })
      }
    }

  }
</script>
