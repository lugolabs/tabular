/*! tabular v0.1.0
 * https://github.com/lugolabs/tabular#readme
 * 
 * Copyright: Artan Sinani 2016
 * Released under MIT license
 * https://github.com/lugolabs/tabular/blob/master/LICENCE
 * 
 * Date: 2017-01-08
 */
(function(window, undefined){
  'use strict';

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
      var pluginClass = tabular[plugin],
        pluginOptions;

      if (typeof plugin === 'object') {
        $.each(plugin, function(key, value) {
          pluginClass   = tabular[key];
          pluginOptions = value;
        });
      }

      new pluginClass(jElement, options, pluginOptions);
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

  _fetch: function(e, metadata, resetMetadata) {
    this._element.trigger('model:startFetch');

    if (resetMetadata) {
      this._metadata = metadata;
    } else if (metadata) {
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
//     total_pages:  3,
//     page_size:    25
//   }
// }

tabular.Pagination = function(element, options, myOptions) {
  this._element   = element;
  this._options   = options;
  this._myOptions = myOptions || {};
  this._pageSizes = this._myOptions.pageSizes || tabular.Pagination.PAGE_SIZES;
  this._pageSize  = this._pageSizes[0];
  this._init();
};

tabular.Pagination.PAGE_SIZES = [10, 25, 50];

tabular.Pagination.prototype = {
  _page: 1,

  destroy: function() {
    this._element.off('model:success.tabularPagination view:header.tabularPagination');
    this._paginator.remove();
  },

  _init: function() {
    this._element.on('view:header.tabularPagination',   $.proxy(this, '_setup'));
    this._element.on('model:success.tabularPagination', $.proxy(this, '_render'));
  },

  _render: function(e, response) {
    this._page       = response.metadata.current_page;
    this._totalPages = response.metadata.total_pages;
    this._pageSize   = response.metadata.page_size || this._pageSizes[0];
    var options      = { totalPages: this._totalPages };

    if (this._totalPages === 0 || this._page < 2) {
      options.prevDisabled = true;
    }

    if (this._totalPages === 0 || this._page === this._totalPages) {
      options.nextDisabled = true;
    }

    var markup = this._markup(options);
      this._paginator.html(markup);
  },

  _setup: function(e, header) {
    var markup = this._markup({
      prevDisabled: true,
      nextDisabled: true,
      totalPages:   1
    });

    this._paginator = $('<div class="tabular-paginator"/>')
      .html(markup)
      .on('click',  'button', $.proxy(this, '_clickButton'))
      .on('change', 'select[data-action="page"]', $.proxy(this, '_changePage'))
      .on('change', 'select[data-action="size"]', $.proxy(this, '_changeSize'))
      .appendTo(header);

    if (this._myOptions.containerClass) {
      this._paginator.addClass(this._myOptions.containerClass);
    }
  },

  _changePage: function() {
    this._fetch(this._paginator.find('[data-action="page"]').val());
  },

  _changeSize: function() {
    this._fetch(1);
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
    if (page) this._fetch(page);
  },

  _fetch: function(page) {
    this._element.trigger('model:fetch', {
      page:      page,
      page_size: this._paginator.find('[data-action="size"]').val()
    });
  },

  _markup: function(options) {
    var prevDisabled  = options.prevDisabled ? ' disabled="disabled"' : '',
      nextDisabled    = options.nextDisabled ? ' disabled="disabled"' : '',
      buttonClassName = '';

    if (this._myOptions.buttonClass) {
      buttonClassName = ' ' + this._myOptions.buttonClass;
    }

    var markup = [
      '<div class="tabular-paginator-btns">',
        '<button type="button" class="tabular-btn tabular-paginator-btn' + buttonClassName + '" data-action="first"' + prevDisabled + '>First</button>',
        '<button type="button" class="tabular-btn tabular-paginator-btn' + buttonClassName + '" data-action="prev"' + prevDisabled + '>Previous</button>',
        this._buildPagesSelect(options.totalPages),
        '<button type="button" class="tabular-btn tabular-paginator-btn' + buttonClassName + '" data-action="next"' + nextDisabled + '>Next</button>',
        '<button type="button" class="tabular-btn tabular-paginator-btn' + buttonClassName + '" data-action="last"' + nextDisabled + '>Last</button>',
      '</div>',
      this._buildPageSizes()
    ];
    return markup.join('');
  },

  _buildPageSizes: function() {
    var markup = [
      '<div class="tabular-paginator-info">',
        '<select class="tabular-paginator-sizes" data-action="size">'
    ];

    for (var i = 0, length = this._pageSizes.length; i < length; i++) {
      var size   = this._pageSizes[i],
        selected = size === this._pageSize ? ' selected="selected"' : '';
      markup.push('<option value="' + size + '"' + selected + '>' + size + ' rows</option>');
    }

    markup.push('</select> per page</div>');
    return markup.join('');
  },

  _buildPagesSelect: function(totalPages) {
    if (totalPages <= 1) return;

    var options = [];
    for (var i = 1; i <= totalPages; i++) {
      var selected = i === this._page ? ' selected ' : '';
      options.push('<option value="' + i + '"' + selected + '>' + i + '</option>');
    }

    var tag = '<select';
    if (this._myOptions.selectClass) {
      tag += ' class="' + this._myOptions.selectClass + '"';
    }

    return tag + ' data-action="page">' + options.join('') + '</select>';
  }
};

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

/* tabular.Sort
 * send the following data to server for sorting:
 *
 *  sort: {
 *     name: 'id',  // column name
 *     dir:  'desc' // direction, `asc` or `desc`
 *  }
 */
tabular.Sort = function(element, options) {
  this._element   = element;
  this._options   = options;
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
    var dataDirection  = this._DATA_DIRECTION,
      initialSort      = this._options.sort || {},
      initialColumn    = initialSort.name,
      initialDirection = initialSort.dir || 'asc',

      ths = $.map(this._options.columns, function(column) {
        var sorting = column.title,
          direction = 'asc',
          classes   = [],
          className = '',
          linkClass = ['tabular-sort'];

        if (initialColumn === column.name) {
          direction = initialDirection;
          linkClass.push(tabular.Sort.SELECTED_CLASS);
        }

        if (column.sort !== false) {
          sorting = '<a href="#sort" ' + dataDirection + '="' + direction +
                    '" data-column="' + column.name +
                    '" class="' + linkClass.join(' ') + '">' +
                    column.title +
                    '</a>';
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

    var link    = $(e.target),
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

}(window));
