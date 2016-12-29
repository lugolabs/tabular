tabular.Sort = function(element, table, options) {
  this._element = element;
  this._table   = table;
  this._options = options;
  this._init();
};

tabular.Sort.prototype = {
  _init: function() {
    this._head = $('<thead/>')
      .append(this._markup())
      .on('click', '[data-sort]', $.proxy(this, '_onSort'))
      .appendTo(this._table);
  },

  _markup: function() {
    var ths = $.map(this._options.columns, function(column) {
      var sorting = '',
        className = '';
      if (column.sort !== false) {
        sorting = '<button data-sort="asc" data-column="' + column.name + '" class="tabular-sort"></button>';
        className = ' class="tabular-sorting"';
      }
      th = [
        '<th' + className + '>',
          column.title,
          sorting,
        '</th>'
      ];
      return th.join('');
    });
    return '<tr>' + ths.join('') + '</tr>';
  },

  _onSort: function(e) {
    var btn = $(e.target),
      direction = btn.data('sort');
    if (direction === 'asc') {
      direction = 'desc';
    } else {
      direction = 'asc';
    }
    btn.data('sort', direction);
    this._element.trigger('model:fetch', {
      sort: {
        name: btn.data('column'),
        dir:  direction
      }
    });
  }
};
