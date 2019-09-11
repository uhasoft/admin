// 全局函数
exports.install = function (Vue, options) {
    // 时间
    function formatDate (time) {
        return time < 10 ? time = '0' + time : time;
    }
    Vue.prototype.getDate = function (ns) {
      let d = new Date(ns);
      if (ns !== 0 && ns !== null && ns !== '') {
        return [ d.getFullYear(), formatDate(d.getMonth() + 1), formatDate(d.getDate()) ].join('-')
          + ' ' + [ formatDate(d.getHours()), formatDate(d.getMinutes()), formatDate(d.getSeconds()) ].join(':');
      }else{
        return null;
      }
    };
    // 时间转时间戳
    Vue.prototype.getTimeStamp = function(year,month,day){
      let date = new Date(year,month-1,day);
      return date.getTime();
    };
    // 时间戳转时间（yyyy:mm:dd）
    Vue.prototype.getTimeDate = function (time){
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth()+1;
      var d = date.getDate();
      return y + '-' + m + '-' + d;
    };
    Vue.prototype.formatDate = function (row, column) {
      var value = row[column.property];
      if(!value) return '';
      if(/[-]?[0-9]+/.test(value)) {
        var date = new Date(value);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
          + ' ' + (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute) + ":" + (second < 10 ? '0' + second : second);
      }
      return value;
    }

};
