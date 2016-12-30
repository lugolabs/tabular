describe('tabular.Search', function() {
  var element, search;

  beforeEach(function() {
    element = $('<div/>');
    search  = new tabular.Search(element);
  });

  afterEach(function() {
    search.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('renders correctly', function() {
      var markup = [
        '<form class="tabular-search">',
          '<input type="search" name="q">',
        '</form>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });
  });

  describe('events', function() {
    it('triggers a search when submitting search form', function() {
      var term = 'se',
        data;

      element.on('model:fetch', function(e, dt) {
        data = dt;
      });

      element.find('input[type="search"]').val(term);
      element.find('form').submit();

      chai.assert.deepEqual({ q: term }, data);
    });

    it('triggers a search when writing on search box', function(done) {
      var term = 'se',
        data;

      element.on('model:fetch', function(e, dt) {
        data = dt;
      });

      element.find('input[type="search"]').val(term).keyup();

      setTimeout(function() {
        done();
        chai.assert.deepEqual({ q: term }, data);
      }, 500);
    });
  });

  describe('destroy', function() {
    it('removes search element', function() {
      search.destroy();
      chai.assert.equal('', element.html());
    });
  });
});
