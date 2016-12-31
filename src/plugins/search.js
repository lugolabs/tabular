tabular.Search = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Search.prototype = {
  destroy: function() {
    this._input.remove();
    this._form.remove();
  },

  _init: function() {
    this._form  = $('<form class="tabular-search"/>');
    this._input = $('<input type="search" name="q" />')
      .on('keyup', $.proxy(this, '_search'))
      .appendTo(this._form);
    this._form
      .prependTo(this._element)
      .on('submit', $.proxy(this, '_submitSearch'));
    this._addCss();
  },

  _addCss: function() {
    var classes = this._options.plugins && this._options.plugins.Search && this._options.plugins.Search.classes;
    if (!classes) return;

    if (classes.form) this._form.addClass(classes.form);
    if (classes.input) this._input.addClass(classes.input);
  },

  _submitSearch: function(e) {
    e.preventDefault();
    this._searchNow();
  },

  _search: function(e) {
    if (e.which === 13) return; // Ignore ENTER, handled via submit
    setTimeout($.proxy(this, '_searchNow'), 500);
  },

  _searchNow: function(e) {
    var term = $.trim(this._input.val());
    this._element.trigger('model:fetch', { q: term });
  }
};
