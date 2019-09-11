<template>
  <div>
    <div class="top">
      <div class="title" style="margin-bottom: 20px">结束任务</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="Decision" prop="decision">
          <el-input v-model="form.decision"  style="width: 50%;"></el-input>
        </el-form-item>
        <el-form-item label="Comment" prop="comment">
          <el-input v-model="form.comment"  style="width: 50%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()" v-loading="editLoading">确定</el-button>
        <el-button @click="$router.back();">取消</el-button>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        taskId: '',
        editLoading:false,
        form: {
          decision:''
        },
        rules:{
          decision: [
            { required: true, message: '请输入decision', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '请输入你的评论', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      const self = this;
      self.taskId = self.$route.params.id;
    },
    methods: {
      save() {
        const self = this;
        self.$refs['form'].validate((valid) => {
          if (valid) {
            self.$api.post('/flow/task/' + self.taskId + '/closure', self.form, r=>{
              self.$message({
                message: "操作成功！",
                type: 'success'
              });
              self.editLoading = false;
              self.$router.back();
            });
          }
        })
      },
    }
  }
</script>
<style>
  .upload_file {
      display: inline-block;
      position: relative;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
  }
  .upload_file input[type=file] {
      position: absolute;
      left: 0;
      top: 0;
      bottom:0;
      right:0;
      width: 100%;
      opacity: 0;
      cursor: pointer;
  }
  .upload_file .submit_style {
      display: inline-block;
      width: 100%;
      text-align: center;
      font-family: "Microsoft yahei";
      background-color: #409eff;
      color: #FFF;
      text-decoration: none;
  }
  .submit_style{
      padding:8px 12px;
      border:none;
      background-color: #409eff;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      color: #fff;
  }
  .download{
      display: inline-block;
      padding: 8px 12px;
      border: none;
      background-color: #409eff;
      border-radius: 3px;
      color: #fff;
      font-size: 13px;
  }
</style>
