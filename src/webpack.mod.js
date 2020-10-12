/*! exports provided: square, cube, default */
/***/ (function (module, exports, require) {

  "use strict";
  require.r(exports);
    /* harmony export (binding) */ require.d(exports, "square", function () { return square; });
    /* harmony export (binding) */ require.d(exports, "cube", function () { return cube; });
  /**
   * math.js
   * 
   * sobird<i@sobird.me> at 2019-11-07 15:28:30 build.
   */
  function square(x) {
    return x * x;
  }

  function cube(x) {
    return x * x * x;
  }

    /* harmony default export */ exports["default"] = ({
    square
  });
  /***/
})


