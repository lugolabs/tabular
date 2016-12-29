tabular.Loader = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Loader.prototype = {
  destroy: function() {
    this._element.off('model:startFetch.tabularLoader model:stopFetch.tabularLoader');
  },

  _init: function() {
    this._loader = $('<div/>')
      .addClass('tabular-loader')
      .text('Loading ...')
      .appendTo(this._element);
    this._bind();
  },

  _bind: function() {
    this._element.on('model:startFetch.tabularLoader', $.proxy(this, '_start'));
    this._element.on('model:stopFetch.tabularLoader',  $.proxy(this, '_stop'));
  },

  _start: function() {
    this._loader.show();
  },

  _stop: function() {
    this._loader.hide ();
  }
};
