describe('tabular.Search', function() {
  var element, search;

  beforeEach(function() {
    element = $('<div/>');
    search  = new tabular.Search(element, {
      plugins: {
        Search: {
          classes: {
            form: 'form-horizontal',
            input: 'search-box'
          }
        }
      }
    });
  });

  afterEach(function() {
    search.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('renders correctly', function() {
      var markup = [
        '<form class="tabular-search form-horizontal">',
          '<input type="search" name="q" class="search-box">',
        '</form>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it('applies optional CSS classes', function() {
      chai.assert(element.find('form').hasClass('form-horizontal'));
      chai.assert(element.find('form input').hasClass('search-box'));
    });
  });

  describe('events', function() {
    var term = 'se',
        data;

    beforeEach(function() {
      data = null;
      element.on('model:fetch', function(e, dt) {
        data = dt;
      });
    });

    it('triggers a search when submitting search form', function() {
      element.find('input[type="search"]').val(term);
      element.find('form').submit();

      chai.assert.deepEqual({ q: term }, data);
    });

    it('triggers a search when writing on search box', function(done) {
      element.find('input[type="search"]').val(term).keyup();

      setTimeout(function() {
        done();
        chai.assert.deepEqual({ q: term }, data);
      }, 500);
    });

    it("doesn't trigger a search when pressing ENTER on search box", function(done) {
      var event   = $.Event('keyup');
      event.which = 13; // ENTER key code
      element.find('input[type="search"]').val(term).trigger(event);

      setTimeout(function() {
        done();
        chai.assert.isNull(data);
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
