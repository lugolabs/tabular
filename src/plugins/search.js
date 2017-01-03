tabular.Search = function(element, options, myOptions) {
  this._element   = element;
  this._options   = options;
  this._myOptions = myOptions || {};
  this._init();
};

tabular.Search.prototype = {
  destroy: function() {
    this._input.remove();
    this._form.remove();
    this._element.off('view:header.tabularSearch');
  },

  _init: function() {
    this._element.on('view:header.tabularSearch', $.proxy(this, '_setup'));
  },

  _setup: function(e, header) {
    this._form  = $('<form class="tabular-search"/>');
    this._input = $('<input type="search" name="q" placeholder="Search ..." />')
      .on('keyup', $.proxy(this, '_search'))
      .appendTo(this._form);
    this._form
      .prependTo(header)
      .on('submit', $.proxy(this, '_submitSearch'));
    this._addCss();
  },

  _addCss: function() {
    if (this._myOptions.formClass)  this._form.addClass(this._myOptions.formClass);
    if (this._myOptions.inputClass) this._input.addClass(this._myOptions.inputClass);
  },

  _submitSearch: function(e) {
    e.preventDefault();
    this._searchNow();
  },

  _search: function(e) {
    if (this._searchTimeout) clearTimeout(this._searchTimeout);
    if (e.which === 13) return; // Ignore ENTER, handled via submit
    this._searchTimeout = setTimeout($.proxy(this, '_searchNow'), 500);
  },

  _searchNow: function(e) {
    var term = $.trim(this._input.val());
    this._element.trigger('model:fetch', [{ q: term }, true]);
  }
};
