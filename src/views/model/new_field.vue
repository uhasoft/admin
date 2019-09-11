<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="110px" :rules="rules" :model="form">

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"  style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="字段类型" prop="field_type">
        <el-select v-model="form.field_type"  style="width: 70%;">
          <el-option v-for="item in fieldTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据来源" prop="data_source">
        <el-input v-model="form.data_source"  style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="模型" prop="model_id">
        <el-select v-model="form.model_id" @change="loadFields()">
          <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段" prop="field_id">
        <el-select v-model="form.field_id">
          <el-option v-for="item in fields" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序号" prop="sort_index">
        <el-input v-model="form.sort_index"  style="width: 80%;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave('form')" v-loading="editLoading">保存</el-button>
      <el-button @click="handleCancel()">取消</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        id: '',
        model_id: '',
        models:[],
        fields:[],
        fieldTypes:[],
        labelPosition:'left',
        editLoading:false,
        form: {},
        operations:[],
        rules: {
        },
        templates:[],
        templateFields:[]
      }
    },
    created : function(){
      const self = this;
      self.id = self.$route.params.id;
      self.model_id = self.$route.params.modelId;
      if(!self.id && !self.model_id){
        self.$router.back();
      } else {
        if(self.id){
          self.$api.get('/new_field/' + self.id, null, r=>{
            self.form = Object.assign({},r.data);
            self.loadFields();
          });
        } else if(self.model_id){
          self.form.model_id = self.model_id;
          self.loadFields();
        }
        self.$api.get('/model/all', null, r=>{
          self.models = r.data;
        });
        self.$api.get('/enum/FieldType/all', null, r=>{
          self.fieldTypes = r.data;
        });
      }
    },
    methods:{
      handleSave (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid)=> {
          if (valid) {
            this.editLoading = true;
            self.$api.post('/new_field', self.form, r => {
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
      loadFields() {
        const self = this;
        if(self.form.model_id){
          self.$api.get('/field/model/' + self.form.model_id, null, r=> {
            self.fields = r.data;
          })
        }
      },
      handleCancel(){    // 取消
        this.$router.back();
      },
      resetForm(form) {       // 重置
        this.$refs[form].resetFields();
      },
    }

  }
</script>
