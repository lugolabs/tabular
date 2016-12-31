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
