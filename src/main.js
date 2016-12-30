$.extend(tabular, {
  start: function(element, options) {
    var defaults = {
      addHeading: function(el, tbl, opts) {
        new tabular.Sort(el, tbl, opts);
      },
      plugins: [
        'Model',
        'Pagination',
        'Search',
        'Loader'
      ]
    };

    options = $.extend({}, defaults, options);

    var jElement = $(element);

    $.map(options.plugins, function(plugin) {
      var pluginClass = typeof plugin === 'string' ? tabular[plugin] : plugin;
      new pluginClass(jElement, options);
    });

    new tabular.View(jElement, options);

    return jElement;
  }
});
