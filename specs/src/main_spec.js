describe('tabular', function(){
  describe('#start', function(){
    it('should return element', function() {
      var element = $('<div id="tabular"/>'),
        newElement = tabular.start(element[0], { columns: [] });
      chai.assert.equal(element.prop('id'), newElement.prop('id'));
    });
  });
});
