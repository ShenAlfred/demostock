import { dateFormat } from 'vux';

export default {
  getMinAndMax: function(arrays) {
    var _arrays = [], startDate, endDate;
    for(var i = 0; i<arrays.length; i++) {
      _arrays.push(new Date(arrays[i]).getTime());
    }
    // console.log(_arrays);
    // console.log(Math.max.apply(null, _arrays));
    // console.log(Math.min.apply(null, _arrays));
    return {
      startDate : dateFormat(new Date(Math.min.apply(null, _arrays)), 'YYYY-MM-DD'),
      endDate : dateFormat(new Date(Math.max.apply(null, _arrays)), 'YYYY-MM-DD')
    }
  }
}
