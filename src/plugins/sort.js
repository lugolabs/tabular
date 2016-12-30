tabular.Sort = function(element, table, options) {
  this._element = element;
  this._table   = table;
  this._options = options;
  this._init();
};

tabular.Sort.SELECTED_CLASS = 'tabular-sort-selected';

tabular.Sort.prototype = {
  _DATA_DIRECTION: 'data-sort',

  destroy: function() {
    this._head.remove();
  },

  getSortingDirection: function(btn) {
    return btn.attr(this._DATA_DIRECTION);
  },

  _init: function() {
    this._head = $('<thead/>')
      .append(this._markup())
      .on('click', '['+ this._DATA_DIRECTION +']', $.proxy(this, '_onSort'))
      .appendTo(this._table);
  },

  _markup: function() {
    var that = this;
    var ths = $.map(this._options.columns, function(column) {
      var sorting = column.title,
        className = '';
      if (column.sort !== false) {
        sorting   = '<a href="#sort" ' + that._DATA_DIRECTION +'="asc" data-column="' + column.name + '" class="tabular-sort">' + column.title + '</a>';
        className = ' class="tabular-sorting"';
      }
      th = [
        '<th' + className + '>',
          sorting,
        '</th>'
      ];
      return th.join('');
    });
    return '<tr>' + ths.join('') + '</tr>';
  },

  _onSort: function(e) {
    var link     = $(e.target),
      direction = 'asc';

    if (link.hasClass(tabular.Sort.SELECTED_CLASS) && this.getSortingDirection(link) === 'asc') {
      direction = 'desc';
    }

    this._setDirection(link, direction);
    this._select(link);

    this._element.trigger('model:fetch', {
      sort: {
        name: link.data('column'),
        dir:  direction
      }
    });
  },

  _select: function(link) {
    if (this._selectedLink && this._selectedLink.data('column') != link.data('column')) {
      this._setDirection(this._selectedLink, 'asc');
      this._selectedLink.removeClass(tabular.Sort.SELECTED_CLASS);
    }
    this._selectedLink = link;
    this._selectedLink.addClass(tabular.Sort.SELECTED_CLASS);
  },

  _setDirection: function(link, direction) {
    link.attr(this._DATA_DIRECTION, direction);
  }
};
