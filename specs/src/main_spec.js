describe('tabular', function() {
  describe('#start', function() {
    var element;

    beforeEach(function() {
      element = $('<div id="tabular"/>');
    });

    afterEach(function() {
      element.remove();
    });

    it('should return element', function() {
      var newElement = tabular.start(element[0], { columns: [] });
      chai.assert.equal(element.prop('id'), newElement.prop('id'));
    });
  });
});
