describe('tabular.Sort', function() {
  var element, table, tabularSort;

  beforeEach(function() {
    element     = $('<div/>');
    table       = $('<table/>').appendTo(element);
    tabularSort = new tabular.Sort(element, table, {
      columns: [
        { name: 'id',   title: 'Id' },
        { name: 'name', title: 'Name' }
      ]
    });
  });

  afterEach(function() {
    // tabularSort.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('renders buttons in headings', function() {
      var markup = [
        '<thead>',
          '<tr>',
            '<th class="tabular-sorting">',
              'Id',
              '<button data-sort="asc" data-column="id" class="tabular-sort"></button>',
            '</th>',
            '<th class="tabular-sorting">',
              'Name',
              '<button data-sort="asc" data-column="name" class="tabular-sort"></button>',
            '</th>',
          '</tr>',
        '</thead>'
      ].join('');
      chai.assert.equal(markup, table.html());
    });
  });

  describe('destroy', function() {
    it('removes heading');
  });
});
