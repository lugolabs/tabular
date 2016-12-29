describe('tabular', function(){
  it('is created', function() {
    chai.assert.isObject(tabular);
  });

  describe('VERSION', function() {
    it('shows current version', function() {
      chai.assert.equal('0.1.0', tabular.VERSION);
    });
  });
});
