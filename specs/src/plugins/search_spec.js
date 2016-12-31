describe('tabular.Search', function() {
  var element, header, search;

  beforeEach(function() {
    element = $('<div/>');
    header  = $('<div/>').appendTo(element);
    search  = new tabular.Search(element, {}, {
      formClass: 'form-horizontal',
      inputClass: 'search-box'
    });
    element.trigger('view:header', [header]);
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
      chai.assert.equal(markup, header.html());
    });

    it('applies optional CSS classes', function() {
      chai.assert(header.find('form').hasClass('form-horizontal'));
      chai.assert(header.find('form input').hasClass('search-box'));
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
      header.find('input[type="search"]').val(term);
      header.find('form').submit();

      chai.assert.deepEqual({ q: term }, data);
    });

    it('triggers a search when writing on search box', function(done) {
      header.find('input[type="search"]').val(term).keyup();

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
      chai.assert.equal(1, $._data(element[0]).events['view:header'].length);

      search.destroy();

      chai.assert.equal('', header.html());
      chai.assert.isUndefined($._data(element[0]).events);
    });
  });
});
