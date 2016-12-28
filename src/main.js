$.extend(tabular, {
  start: function(element, options) {
    var jElement = $(element),
      view = new tabular.View(jElement, options);

    return jElement;
  }
});
