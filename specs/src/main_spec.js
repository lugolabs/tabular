describe('tabular.main', function() {
  var columns = [{ name: 'name', title: 'Name' }],
    element, newElement;

  beforeEach(function() {
    element = $('<div id="tabular"/>');
  });

  afterEach(function() {
    newElement.remove();
    element.remove();
  });

  describe('start', function() {
    var server;

    beforeEach(function() {
      server  = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    it('should return element', function() {
      newElement = tabular.start(element[0], { columns: columns });
      chai.assert.equal(element.prop('id'), newElement.prop('id'));
    });

    it('renders correctly with default plugins', function() {
      newElement = tabular.start(element[0], { columns: columns });
      var markup = [
        '<div class="tabular-loader" style="display: block;">Loading ...</div>',
        '<div class="tabular-header">',
          '<form class="tabular-search">',
            '<input type="search" name="q">',
          '</form>',
          '<div class="tabular-paginator">',
            '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
            '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
            '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
            '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
          '</div>',
        '</div>',
        '<table>',
          '<thead>',
            '<tr>',
              '<th class="tabular-sorting">',
                '<a href="#sort" data-sort="asc" data-column="name" class="tabular-sort">Name</a>',
              '</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>',
        '<div class="tabular-footer"></div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it("doesn't render the plugins not included", function() {
      newElement = tabular.start(element[0], {
        columns: columns,
        plugins: [
          'Model',
          'Loader',
          {
            Search: {
              classes: {
                form: 'form-horizontal',
                input: 'search-box'
              }
            }
          }
        ]
      });
      var markup = [
        '<div class="tabular-loader" style="display: block;">Loading ...</div>',
        '<div class="tabular-header">',
          '<form class="tabular-search form-horizontal">',
            '<input type="search" name="q" class="search-box">',
          '</form>',
        '</div>',
        '<table>',
          '<thead>',
            '<tr>',
              '<th>Name</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>',
        '<div class="tabular-footer"></div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });
  });

  describe('custom plugin', function() {
    it('hooks into view events', function() {
      tabular.CustomPlugin = function(element, options, customOptions) {
        element.on('view:header.CustomPlugin', function(e, header) {
          header.prepend('<div class="custom-title">Title: ' + customOptions.title + '</div>');
        });
      };

      newElement = tabular.start(element[0], {
        columns: columns,
        plugins: [
          {
            CustomPlugin: {
              title: 'My Custom Plugin'
            }
          }
        ]
      });
    });
  });
});
