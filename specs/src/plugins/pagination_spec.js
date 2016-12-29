describe('tabular.Pagination', function() {
  var element, pagination;

  beforeEach(function() {
    element    = $('<div/>');
    pagination = new tabular.Pagination(element);
  });

  afterEach(function() {
    pagination.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('renders correct markup', function() {
      var markup = [
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
        '</div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });
  });

  describe('model fetch success', function() {
    it('renders correct markup on the first page', function() {
      element.trigger('model:success', {
        metadata: { current_page: 1, total_pages: 4 }
      });

      var markup = [
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
          '<select>',
            '<option value="1" selected="">1</option>',
            '<option value="2">2</option>',
            '<option value="3">3</option>',
            '<option value="4">4</option>',
          '</select>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last">Last</button>',
        '</div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it('renders correct markup on a middle page', function() {
      element.trigger('model:success', {
        metadata: { current_page: 2, total_pages: 4 }
      });

      var markup = [
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev">Previous</button>',
          '<select>',
            '<option value="1">1</option>',
            '<option value="2" selected="">2</option>',
            '<option value="3">3</option>',
            '<option value="4">4</option>',
          '</select>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last">Last</button>',
        '</div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it('renders correct markup on the last page', function() {
      element.trigger('model:success', {
        metadata: { current_page: 4, total_pages: 4 }
      });

      var markup = [
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev">Previous</button>',
          '<select>',
            '<option value="1">1</option>',
            '<option value="2">2</option>',
            '<option value="3">3</option>',
            '<option value="4" selected="">4</option>',
          '</select>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
        '</div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });
  });

  describe('destroy', function() {
    it('removes pagination element and event handlers on element', function() {
      pagination.destroy();
      chai.assert.isUndefined($._data(element[0]).events);
      chai.assert.equal('', element.html());
    });
  });
});
