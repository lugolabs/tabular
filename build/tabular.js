var tabular = window.tabular = {};

tabular.Loader = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Loader.prototype = {
  destroy: function() {
    this._element.off('model:startFetch model:stopFetch');
  },

  _init: function() {
    this._loader = $('<div/>')
      .addClass('tabular-loader')
      .text('Loading ...')
      .appendTo(this._element);
    this._bind();
  },

  _bind: function() {
    this._element.on('model:startFetch', $.proxy(this, '_start'));
    this._element.on('model:stopFetch',  $.proxy(this, '_stop'));
  },

  _start: function() {
    this._loader.show();
  },

  _stop: function() {
    this._loader.hide ();
  }
};

$.extend(tabular, {
  start: function(element, options) {
    var jElement = $(element),
      view = new tabular.View(jElement, options);

    return jElement;
  }
});

tabular.Model = function(element, options) {
  this._element = element;
  this._options = options;

  this._element.on('model:fetch', $.proxy(this, '_fetch'));
};

tabular.Model.prototype = {
  _metadata: {},

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

// Main tabular view,
// - creates the table and headers
// - binds the data to the view
// - autopopulates

tabular.View = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
  return this._element;
};

tabular.View.prototype = {
  _init: function() {
    this._bind();
    this._setup();
    this._element.trigger('model:fetch');
  },

  _setup: function() {
    this._element.addClass('tabular');
    this._table = $('<table/>').appendTo(this._element);
    this._addHeading();
    this._addBody();
  },

  _addHeading: function() {
    if (this._options.addHeading) {
      this._options.addHeading(this._element, this._table, this._options);
      return;
    }
    var ths = $.map(this._options.columns, function(column) {
      return '<th>' + column.title + '</th>';
    });
    this._table.append('<thead><tr>' + ths.join('') + '</th></thead>');
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
    this._element.on('model:success', $.proxy(this, '_render'));
  }
};
