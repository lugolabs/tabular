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
