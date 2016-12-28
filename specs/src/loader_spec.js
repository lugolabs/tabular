describe('tabular.Loader', function() {
  var element, loader;

  beforeEach(function() {
    element = $('<div/>').appendTo($('body'));
    loader  = new tabular.Loader(element);
  });

  afterEach(function() {
    loader.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('build the markup', function() {
      chai.assert.equal('<div class="tabular-loader">Loading ...</div>', element.html());
      chai.assert.isTrue(element.find('.tabular-loader').is(':visible'));
    });

    it('binds to model startFetch event', function() {
      element.trigger('model:startFetch');
      chai.assert.isTrue(element.find('.tabular-loader').is(':visible'));
    });

    it('binds to model stopFetch event', function() {
      element.trigger('model:stopFetch');
      chai.assert.isFalse(element.find('.tabular-loader').is(':visible'));
    });
  });

  describe('destroy', function() {
    var loaderElement;

    beforeEach(function() {
      loaderElement = element.find('.tabular-loader');
      loader.destroy();
    });

    it('removes model startFetch event handler from element', function() {
      loaderElement.hide();

      element.trigger('model:startFetch');
      chai.assert.isFalse(loaderElement.is(':visible'));
    });

    it('removes model stopFetch event handler from element', function() {
      element.trigger('model:stopFetch');
      chai.assert.isTrue(loaderElement.is(':visible'));
    });
  });
});
