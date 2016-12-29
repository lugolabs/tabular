describe('tabular.Search', function() {
  var element, search;

  beforeEach(function() {
    element = $('<div/>');
    search = tabular.Search(element);
  });

  afterEach(function() {
    // search.destroy();
    element.remove;
  });

  describe('constructor', function() {
    it('renders correctly', function() {
      chai.assert.equal('', element.html());
    });
  });

  describe('destroy', function() {
    it('removes search element');
  });
});
