describe('tabular', function() {
  describe('start', function() {
    var columns = [{ name: 'name', title: 'Name' }],
      element, newElement;

    beforeEach(function() {
      element = $('<div id="tabular"/>');
    });

    afterEach(function() {
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
        '<table>',
          '<thead>',
            '<tr>',
              '<th class="tabular-sorting">',
                'Name',
                '<button data-sort="asc" data-column="name" class="tabular-sort"></button>',
              '</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>',
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
        '</div>',
        '<div class="tabular-loader">Loading ...</div>'
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
        '<table>',
          '<thead>',
            '<tr>',
              '<th class="tabular-sorting">',
                'Name',
                '<button data-sort="asc" data-column="name" class="tabular-sort"></button>',
              '</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>',
        '<div class="tabular-loader">Loading ...</div>'
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
        '<table>',
          '<thead>',
            '<tr>',
              '<th>Name</th>',
            '</tr>',
          '</thead>',
          '<tbody></tbody>',
        '</table>',
        '<div class="tabular-paginator">',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first" disabled="disabled">First</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev" disabled="disabled">Previous</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next" disabled="disabled">Next</button>',
          '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last" disabled="disabled">Last</button>',
        '</div>',
        '<div class="tabular-loader">Loading ...</div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });
  });
});
