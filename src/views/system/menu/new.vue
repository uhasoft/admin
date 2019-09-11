<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="110px" :rules="rules" :model="form">

      <el-form-item label="父菜单" prop="parentId">
        <el-select v-model="form.parentId">
          <el-option v-for="item in parents" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名(name)" prop="name" :rules="{ required: true, message: '请输入节点名', trigger: 'blur' }">
        <el-input v-model="form.name"  style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="图标(icon)" prop="icon">
        <el-input v-model="form.icon" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="链接(url)" prop="url">
        <el-input v-model="form.url" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="索引(index)" prop="itemIndex" :rules="{ required: true, message: '请输入索引', trigger: 'blur' }">
        <el-input v-model="form.itemIndex" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="叶子节点(leaf)" prop="leaf" :rules="{ required: true, message: '请选择是否是叶子节点', trigger: 'blur' }">
        <el-radio-group v-model="form.leaf" style="width:80%;">
          <el-radio :label="true" style="width:40%;">是</el-radio>
          <el-radio :label="false" style="width:40%;">否</el-radio>
        </el-radio-group>
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
        labelPosition:'left',
        editLoading:false,
        form: {},
        operations:[],
        rules: {
        },
        parents:[]
      }
    },
    created : function(){
      const self = this;
      const id = self.$route.params.id;
      const parentId = self.$route.params.parentId;
      if(parentId){
        self.form.parentId = parentId;
      }
      self.$api.get('/menu/non-leaves', null, r=>{
        self.parents = r.data;
      },res=>{
        self.$router.push('/login');
      });
      if(id){
        self.$api.get('/menu/' + id, null,r=>{
          console.log(r.data);
          if(r.code === 0){
            self.form = Object.assign({},r.data);
          }else{
            alert(r.message);
          }
          self.loading = false;
        },res=>{
          self.$router.push('/login');
        });
      }
    },
    methods:{
      handleSave (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid)=> {
          if (valid) {
            this.editLoading = true;
            self.$api.post('/menu', self.form, r => {
              if (r.code === 0) {
                this.$message({
                  message: "操作成功！",
                  type: 'success'
                });
                this.editLoading = false;
                this.$router.back();

              } else {
                alert(r.message);
                this.editLoading = false;
              }
            }, res => {
              this.$router.push({
                path: '/login',
              });
            });
          }else{

          }
        })
      },
      handleTemplateChange(){
        const self = this;
        self.$api.get('/list_template_field/template/' + self.form.listTemplateId, null, r => {
          if (r.code === 0) {
            self.templateFields = r.data;
          } else {
            alert(r.message);
          }
          self.editLoading = false;
        },res=>{
          self.$router.push('/login');
        });
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
