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
