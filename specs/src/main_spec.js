describe('tabular.main', function() {
  describe('start', function() {
    var columns = [{ name: 'name', title: 'Name' }],
      element, newElement, server;

    beforeEach(function() {
      element = $('<div id="tabular"/>');
      server  = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
      newElement.remove();
      element.remove();
    });

    it('should return element', function() {
      newElement = tabular.start(element[0], { columns: columns });
      chai.assert.equal(element.prop('id'), newElement.prop('id'));
    });

    it('renders correctly with default plugins', function() {
      newElement = tabular.start(element[0], { columns: columns });
      var markup = [
        '<form class="tabular-search">',
          '<input type="search" name="q">',
        '</form>',
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
        '</div>',
        '<div class="tabular-loader" style="display: block;">Loading ...</div>',
        '<table>',
          '<thead>',
            '<tr>',
              '<th class="tabular-sorting">',
                '<a href="#sort" data-sort="asc" data-column="name" class="tabular-sort">Name</a>',
              '</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it("doesn't render the plugins not included", function() {
      newElement = tabular.start(element[0], {
        columns: columns,
        plugins: [
          'Model',
          'Loader'
        ]
      });
      var markup = [
        '<div class="tabular-loader" style="display: block;">Loading ...</div>',
        '<table>',
          '<thead>',
            '<tr>',
              '<th class="tabular-sorting">',
                '<a href="#sort" data-sort="asc" data-column="name" class="tabular-sort">Name</a>',
              '</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it("doesn't render sorting if not included", function() {
      newElement = tabular.start(element[0], {
        columns:    columns,
        addHeading: null
      });
      var markup = [
        '<form class="tabular-search">',
          '<input type="search" name="q">',
        '</form>',
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
        '</div>',
        '<div class="tabular-loader" style="display: block;">Loading ...</div>',
        '<table>',
          '<thead>',
            '<tr>',
              '<th>Name</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });
  });
});
