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
