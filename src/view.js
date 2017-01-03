/* tabular.View
 * Main tabular view
 * - creates the table and headers
 * - binds the data to the view
 * - autopopulates
 */
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
    this._element.addClass('tabular');
    this._createElAndTriggerEvent('header', this._options.headerClass);
    this._addTable();
    this._createElAndTriggerEvent('footer', this._options.footerClass);
    this._fetch();
  },

  _fetch: function() {
    var data = null;
    if (this._options.sort) {
      data = { sort: this._options.sort };
    }
    this._element.trigger('model:fetch', data);
  },

  _createElAndTriggerEvent: function(attr, className) {
    var el = $('<div/>')
      .addClass('tabular-' + attr)
      .appendTo(this._element);
    if (className) el.addClass(className);
    this._element.trigger('view:' + attr, [el]);
  },

  _addTable: function() {
    this._table = $('<table/>').appendTo(this._element);
    if (this._options.tableClass) this._table.addClass(this._options.tableClass);
    this._addTableHead();
    this._addTableBody();
  },

  _addTableHead: function() {
    var cssClass,

      ths = $.map(this._options.columns, function(column) {
        cssClass = column.css ? ' class="' + column.css + '"' : '';
        return '<th' + cssClass + '>' + column.title + '</th>';
      }),

      head = $('<thead/>')
        .html('<tr>' + ths.join('') + '</th>')
        .appendTo(this._table);

    this._element.trigger('view:tableHead', [head]);
  },

  _addTableBody: function() {
    this._tbody = $('<tbody/>').appendTo(this._table);
  },

  _render: function(e, response) {
    this._tbody.html($.map(response.data, $.proxy(this, '_processRow')));
    this._element.trigger('view:afterRender', response);
  },

  _processRow: function(rowData) {
    var cssClass,
      tds = $.map(this._options.columns, function(column) {
        cssClass = column.css ? ' class="' + column.css + '"' : '';
        return '<td' + cssClass + '>' + rowData[column.name] + '</td>';
      });
    return '<tr>' + tds.join('') + '</tr>';
  },

  _bind: function() {
    this._element.on('model:success.tabularView', $.proxy(this, '_render'));
  }
};
