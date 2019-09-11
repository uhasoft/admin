<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="110px" :model="form">
      <el-form-item v-for="f in newFields" v-bind:key="f.id" :label="f.name" :prop="f.propName">
        <el-input v-if="f.fieldType == 'Text'" v-model="form[f.propName]"  style="width: 80%;"></el-input>
        <el-select v-if="f.fieldType == 'Select'" v-model="form[f.propName]">
          <el-option v-for="item in optionData[f.propName]" v-bind:key="item.id" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-if="f.fieldType == 'StaticSelect'" v-model="form[f.propName]">
          <el-option v-for="item in optionData[f.propName]" v-bind:key="item.id" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <el-cascader v-if="f.fieldType == 'CascadeSelect'" :options="optionData[f.propName]" v-model="form[f.propName]" :props="props" clearable/>

        <div v-if="f.fieldType == 'File'">
          <input type="file" name="file" id="file" ref="file" />
          <input type="button" size="small" value="上传文件"/>
          <div style="display: inline;" v-text="form.filename"></div>
        </div>

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave('form')" v-loading="editLoading">保存</el-button>
      <el-button @click="$router.back();">取消</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      const self = this;
      const alias = self.$route.path.split('/')[1];
      return {
        alias: alias,
        id: '',
        labelPosition:'left',
        editLoading:false,
        form: {},
        optionData: {

        },
        newFields:[],
        props: {
          value: 'id',
          label: 'name',
          children: 'children',
          expandTrigger: 'hover',
          emitPath: false,
          lazy: true,
          lazyLoad (node, resolve) {
            if(node.value){
              if(node.children && node.children.length > 0){
                resolve();
              } else {
                setTimeout(() => {
                  self.$api.get('/field/node/field/' + node.value, null, r=>{
                    self.$set(self.optionData, node.value, r.data);
                    resolve(r.data);
                  });
                }, 300);
              }
            }
          }
        }
      }
    },
    created : function(){
      const self = this;
      for(let prop in self.$route.query){
        if(prop !== 'id' && self.$route.query.hasOwnProperty(prop)){
          self.form[prop] = self.$route.query[prop];
        }
      }
      self.id = self.$route.params.id;
      //获取所有字段
      self.$api.get('/new_field/alias/' + self.alias, null, r=>{
        self.newFields = r.data;
        for(let i = 0; i < self.newFields.length; i++){
          //form中只保留必要属性，否则提交时会带有其他脏属性
          let existingValue = self.form[self.newFields[i].propName];
          self.$set(self.form, self.newFields[i].propName, existingValue ? existingValue : '');
          if(self.newFields[i].fieldType === 'Select'
          || self.newFields[i].fieldType === 'CascadeSelect'){
            self.$api.get(eval(self.newFields[i].dataSource), null, r=>{
              self.$set(self.optionData, self.newFields[i].propName, r.data);
            });
          }
          if(self.newFields[i].fieldType === 'StaticSelect'){
            self.$set(self.optionData, self.newFields[i].propName, JSON.parse(self.newFields[i].dataSource));
          }
        }
        if(self.id){
          //标准获取记录详情
          self.$api.get('/' + self.alias + '/' + self.id, null,r=>{
            for(let property in self.form){
              if(self.form.hasOwnProperty(property)){
                self.form[property] = r.data[property];
              }
            }
            self.loading = false;
          });
        }
      });

    },
    methods:{
      handleSave (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid)=> {
          if (valid) {
            this.editLoading = true;
            let handler = function(){
              self.$message({
                message: "操作成功！",
                type: 'success'
              });
              self.editLoading = false;
              self.$router.back();
            };
            let action = '?action=save';
            if(self.id){
              self.$api.put('/' + self.alias + "/" + self.id + action, self.form, handler);
            } else {
              self.$api.post('/' + self.alias + action, self.form, handler);
            }
          }
        })
      }
    }
  }
</script>
