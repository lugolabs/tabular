// Main tabular view,
// - creates the table and headers
// - binds the data to the view
// - autopopulates

tabular.View = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.View.prototype = {
  destroy: function() {
    this._element.off('model:success.tabularView');
  },

  _init: function() {
    this._bind();
    this._addCss();
    this._addTable();
    this._addHead();
    this._addBody();
    this._fetch();
  },

  _fetch: function() {
    this._element.trigger('model:fetch');
  },

  _addCss: function() {
    this._element.addClass('tabular');
    if (this._options.className) {
      this._element.addClass(this._options.className);
    }
  },

  _addTable: function() {
    this._table = $('<table/>').appendTo(this._element);
  },

  _addHead: function() {
    var ths = $.map(this._options.columns, function(column) {
        return '<th>' + column.title + '</th>';
      }),

      head = $('<thead/>')
        .html('<tr>' + ths.join('') + '</th>')
        .appendTo(this._table);

    this._element.trigger('view:tableHead', [head]);
  },

  _addBody: function() {
    this._tbody = $('<tbody/>').appendTo(this._table);
  },

  _render: function(e, response) {
    this._tbody.html($.map(response.data, $.proxy(this, '_processRow')));
  },

  _processRow: function(rowData) {
    var tds = $.map(this._options.columns, function(column) {
      return '<td>' + rowData[column.name] + '</td>';
    });
    return '<tr>' + tds.join('') + '</tr>';
  },

  _bind: function() {
    this._element.on('model:success.tabularView', $.proxy(this, '_render'));
  }
};
