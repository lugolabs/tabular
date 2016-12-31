var tabular = window.tabular = {};

$.extend(tabular, {
  start: function(element, options) {
    var defaults = {
      plugins: [
        'Model',
        'Pagination',
        'Sort',
        'Search',
        'Loader'
      ]
    };

    options = $.extend({}, defaults, options);

    var jElement = $(element);

    $.map(options.plugins, function(plugin) {
      var pluginClass = plugin;
      if (typeof plugin === 'string') {
        pluginClass = tabular[plugin] || pluginClass;
      } else if (typeof plugin === 'object') {
        $.each(plugin, function(key, value) {
          pluginClass = tabular[key] || pluginClass;
        });
      }
      new pluginClass(jElement, options);
    });

    new tabular.View(jElement, options);

    return jElement;
  }
});

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

tabular.Model = function(element, options) {
  this._element = element;
  this._options = options;

  this._element.on('model:fetch.tabularModel', $.proxy(this, '_fetch'));
};

tabular.Model.prototype = {
  _metadata: {},

  destroy: function() {
    this._element.off('model:fetch.tabularModel');
  },

  _fetch: function(e, metadata) {
    this._element.trigger('model:startFetch');

    if (metadata) {
      $.extend(this._metadata, metadata);
    }

    $.ajax({
      url:     this._options.source,
      data:    this._metadata,
      success: $.proxy(this, '_processResponse')
    });
  },

  _processResponse: function(response) {
    this._element.trigger('model:stopFetch', response);
    this._element.trigger('model:success', response);
  }
};

// Adds pagination functionality to tabular
// Expects the server to return an object:
// {
//   metadata: {
//     current_page: 1,
//     total_pages:  3
//   }
// }

tabular.Pagination = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Pagination.prototype = {
  _page: 1,

  destroy: function() {
    this._element.off('model:success.tabularPagination');
    this._paginator.remove();
  },

  _init: function() {
    this._setup();
    this._element.on('model:success.tabularPagination', $.proxy(this, '_render'));
  },

  _render: function(e, response) {
    this._page       = response.metadata.current_page;
    this._totalPages = response.metadata.total_pages;
    var options      = { totalPages: this._totalPages };

    if (this._page < 2) {
      options.prevDisabled = true;
    }
    if (this._page === this._totalPages) {
      options.nextDisabled = true;
    }
    var markup = this._markup(options);
      this._paginator.html(markup);
  },

  _setup: function() {
    var markup = this._markup({
      prevDisabled: true,
      nextDisabled: true,
      totalPages:   1
    });
    this._paginator = $('<div class="tabular-paginator"/>')
      .html(markup)
      .on('click', 'button',  $.proxy(this, '_clickButton'))
      .on('change', 'select', $.proxy(this, '_changeSelect'))
      .appendTo(this._element);
  },

  _changeSelect: function(e) {
    var page = $(e.target).val();
    this._element.trigger('model:fetch', { page: page });
  },

  _clickButton: function(e) {
    var action = $(e.target).data('action'),
      page;
    switch(action) {
      case 'first':
        page = 1;
        break;
      case 'prev':
        page = this._page - 1;
        break;
      case 'next':
        page = this._page + 1;
        break;
      case 'last':
        page = this._totalPages;
        break;
    }
    if (page) {
      this._element.trigger('model:fetch', { page: page});
    }
  },

  _markup: function(options) {
    var prevDisabled = options.prevDisabled ? ' disabled="disabled"' : '',
      nextDisabled   = options.nextDisabled ? ' disabled="disabled"' : '';
    var markup = [
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first"' + prevDisabled + '>First</button>',
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev"' + prevDisabled + '>Previous</button>',
      this._buildSelect(options.totalPages),
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next"' + nextDisabled + '>Next</button>',
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last"' + nextDisabled + '>Last</button>'
    ];
    return markup.join('');
  },

  _buildSelect: function(totalPages) {
    if (totalPages === 1) return;
    var options = [];
    for (var i = 1; i <= totalPages; i++) {
      var selected = i === this._page ? ' selected ' : '';
      options.push('<option value="' + i + '"' + selected + '>' + i + '</option>');
    }
    return '<select>' + options.join('') + '</select>';
  }
};

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

// Should be in sync with package.json
tabular.VERSION = '0.1.0';

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
