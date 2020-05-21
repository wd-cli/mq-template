"use strict";

// import a from '@common/index'
var Index = {
  data: {},
  components: {},
  onShow: function onShow() {
    var test = function test() {
      console.log(2222);
    };

    test(); // a();
  },
  onHide: function onHide() {},
  onLoad: function onLoad() {}
};
Page(Index);