describe('tabular.Pagination', function() {
  var element, header, pagination;

  beforeEach(function() {
    element    = $('<div/>');
    header     = $('<div/>').appendTo(element);
    pagination = new tabular.Pagination(element, null, {
      pageSizes:      [10, 20, 30],
      selectClass:    'select-list',
      buttonClass:    'btn',
      containerClass: 'col-md-6'
    });
    element.trigger('view:header', [header]);
  });

  afterEach(function() {
    pagination.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('renders correct markup', function() {
      var markup = [
        '<div class="tabular-paginator col-md-6">',

          '<div class="tabular-paginator-btns">',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="first" disabled="disabled">First</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="prev" disabled="disabled">Previous</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="next" disabled="disabled">Next</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="last" disabled="disabled">Last</button>',
          '</div>',

          '<div class="tabular-paginator-info">',
            '<select class="tabular-paginator-sizes">',
              '<option selected="selected">10</option>',
              '<option>20</option>',
              '<option>30</option>',
            '</select>',
            ' per page',
          '</div>',

        '</div>'
      ].join('');
      chai.assert.equal(markup, header.html());
    });
  });

  describe('model fetch success', function() {
    it('renders correct markup on the first page', function() {
      element.trigger('model:success', {
        metadata: { current_page: 1, total_pages: 4, page_size: 20 }
      });

      var markup = [
        '<div class="tabular-paginator col-md-6">',

          '<div class="tabular-paginator-btns">',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="first" disabled="disabled">First</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="prev" disabled="disabled">Previous</button>',
            '<select class="select-list">',
              '<option value="1" selected="">1</option>',
              '<option value="2">2</option>',
              '<option value="3">3</option>',
              '<option value="4">4</option>',
            '</select>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="next">Next</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="last">Last</button>',
          '</div>',

          '<div class="tabular-paginator-info">',
            '<select class="tabular-paginator-sizes">',
              '<option>10</option>',
              '<option selected="selected">20</option>',
              '<option>30</option>',
            '</select>',
            ' per page',
          '</div>',

        '</div>'
      ].join('');
      chai.assert.equal(markup, header.html());
    });

    it('renders correct markup on a middle page', function() {
      element.trigger('model:success', {
        metadata: { current_page: 2, total_pages: 4, page_size: 20 }
      });

      var markup = [
        '<div class="tabular-paginator col-md-6">',

          '<div class="tabular-paginator-btns">',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="first">First</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="prev">Previous</button>',
            '<select class="select-list">',
              '<option value="1">1</option>',
              '<option value="2" selected="">2</option>',
              '<option value="3">3</option>',
              '<option value="4">4</option>',
            '</select>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="next">Next</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="last">Last</button>',
          '</div>',

          '<div class="tabular-paginator-info">',
            '<select class="tabular-paginator-sizes">',
              '<option>10</option>',
              '<option selected="selected">20</option>',
              '<option>30</option>',
            '</select>',
            ' per page',
          '</div>',

        '</div>'
      ].join('');
      chai.assert.equal(markup, header.html());
    });

    it('renders correct markup on the last page', function() {
      element.trigger('model:success', {
        metadata: { current_page: 4, total_pages: 4, page_size: 20 }
      });

      var markup = [
        '<div class="tabular-paginator col-md-6">',

          '<div class="tabular-paginator-btns">',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="first">First</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="prev">Previous</button>',
            '<select class="select-list">',
              '<option value="1">1</option>',
              '<option value="2">2</option>',
              '<option value="3">3</option>',
              '<option value="4" selected="">4</option>',
            '</select>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="next" disabled="disabled">Next</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="last" disabled="disabled">Last</button>',
          '</div>',

          '<div class="tabular-paginator-info">',
            '<select class="tabular-paginator-sizes">',
              '<option>10</option>',
              '<option selected="selected">20</option>',
              '<option>30</option>',
            '</select>',
            ' per page',
          '</div>',

        '</div>'
      ].join('');
      chai.assert.equal(markup, header.html());
    });

    it('renders correct markup with no results', function() {
      element.trigger('model:success', {
        metadata: { current_page: 1, total_pages: 0, page_size: 10 }
      });

      var markup = [
        '<div class="tabular-paginator col-md-6">',

          '<div class="tabular-paginator-btns">',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="first" disabled="disabled">First</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="prev" disabled="disabled">Previous</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="next" disabled="disabled">Next</button>',
            '<button type="button" class="tabular-btn tabular-paginator-btn btn" data-action="last" disabled="disabled">Last</button>',
          '</div>',

          '<div class="tabular-paginator-info">',
            '<select class="tabular-paginator-sizes">',
              '<option selected="selected">10</option>',
              '<option>20</option>',
              '<option>30</option>',
            '</select>',
            ' per page',
          '</div>',

        '</div>'
      ].join('');
      chai.assert.equal(markup, header.html());
    });
  });

  describe('destroy', function() {
    it('removes pagination element and event handlers on element', function() {
      chai.assert.equal(1, $._data(element[0]).events['model:success'].length);
      chai.assert.equal(1, $._data(element[0]).events['view:header'].length);

      pagination.destroy();

      chai.assert.isUndefined($._data(element[0]).events);
      chai.assert.equal('', header.html());
    });
  });
});
