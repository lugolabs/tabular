tabular.Sort = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Sort.SELECTED_CLASS = 'tabular-sort-selected';
tabular.Sort.CLICK_EVENT    = 'click.tabularSort';

tabular.Sort.prototype = {
  _DATA_DIRECTION: 'data-sort',

  destroy: function() {
    if (!this._head) return;

    this._head
      .off(tabular.Sort.CLICK_EVENT)
      .html(this._originalMarkup);
  },

  getSortingDirection: function(btn) {
    return btn.attr(this._DATA_DIRECTION);
  },

  _init: function() {
    this._element.on('view:tableHead', $.proxy(this, '_addHead'));
  },

  _addHead: function(e, head) {
    this._originalMarkup = head.html();
    this._head = head
      .html(this._markup())
      .on(tabular.Sort.CLICK_EVENT, '['+ this._DATA_DIRECTION +']', $.proxy(this, '_onSort'));
  },

  _markup: function() {
    var that = this,
      ths = $.map(this._options.columns, function(column) {
        var sorting = column.title,
          classes   = [],
          className = '';

        if (column.sort !== false) {
          sorting = '<a href="#sort" ' + that._DATA_DIRECTION + '="asc" data-column="' + column.name + '" class="tabular-sort">' + column.title + '</a>';
          classes.push('tabular-sorting');
        }

        if (column.css) classes.push(column.css);

        if (classes.length > 0) {
          className = ' class="' + classes.join(' ') + '"';
        }

        var th = [
          '<th' + className + '>',
            sorting,
          '</th>'
        ];
        return th.join('');
      });
    return '<tr>' + ths.join('') + '</tr>';
  },

  _onSort: function(e) {
    e.preventDefault();

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
