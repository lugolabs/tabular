tabular.Search = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Search.prototype = {
  _init: function() {
    this._searchForm  = $('<form class="tabular-search"/>');
    this._searchInput = $('<input type="search" name="q" />')
      .on('keyup', $.proxy(this, '_search'))
      .appendTo(this._searchForm);
    this._searchForm
      .prependTo(this._element)
      .on('submit', $.proxy(this, '_submitSearch'));
  },

  _submitSearch: function(e) {
    e.preventDefault();
    this._searchNow();
  },

  _search: function() {
    setTimeout($.proxy(this, '_searchNow'), 500);
  },

  _searchNow: function(e) {
    var term = $.trim(this._searchInput.val());
    this._element.trigger('model:fetch', { q: term });
  }
};
