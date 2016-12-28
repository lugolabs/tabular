describe('tabular', function(){
  describe('#start', function(){
    it('should return element', function() {
      var element = $('<div id="tabular"/>');
      chai.assert.equal(element.prop('id'), tabular.start(element[0]).prop('id'));
    });
  });
});
