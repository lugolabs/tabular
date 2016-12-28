var tabular = window.tabular = {};


// (function(factory) {

//   // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
//   // We use `self` instead of `window` for `WebWorker` support.
//   var root = (typeof self == 'object' && self.self === self && self) ||
//             (typeof global == 'object' && global.global === global && global);

//   // Set up Tabular appropriately for the environment. Start with AMD.
//   if (typeof define === 'function' && define.amd) {
//     define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
//       // Export global even in AMD case in case this script is loaded with
//       // others that may still expect a global Tabular.
//       root.Tabular = factory(root, exports, _, $);
//     });

//   // Next for Node.js or CommonJS. jQuery may not be needed as a module.
//   } else if (typeof exports !== 'undefined') {
//     var _ = require('underscore'), $;
//     try { $ = require('jquery'); } catch (e) {}
//     factory(root, exports, _, $);

//   // Finally, as a browser global.
//   } else {
//     root.Tabular = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
//   }

// })(function(root, Tabular, $) {
//   console.log(Tabular)

//   // var tabular = window.tabular = {
//   //   start: function(element, options) {
//   //     var jElement = $(element),
//   //       view = new View(jElement, options);

//   //     return jElement;
//   //   }
//   // };
// });

$.extend(tabular, {
  start: function(element, options) {
    var jElement = $(element),
      view = new tabular.View(jElement, options);

    return jElement;
  }
});

tabular.View = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
  return this._element;
};

tabular.View.prototype = {
  _init: function() {
    this._bind();
  },

  _render: function() {
  },

  _bind: function() {
    this._element.on('model:success', $.proxy(this, '_render'));
  }
};
