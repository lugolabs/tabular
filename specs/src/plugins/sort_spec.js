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
    tabularSort.destroy();
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

  describe('events', function() {
    it('sends sort to model when clicking on sorting buttons', function() {
      var data;

      element.on('model:fetch', function(e, dt) {
        data = dt;
      });

      element.find('button[data-sort]:first').trigger('click');

      chai.assert.deepEqual({
        sort: {
          name: 'id',
          dir:  'desc'
        }
      }, data);

      // now click on the other direction
      element.find('button[data-sort]:first').trigger('click');

      chai.assert.deepEqual({
        sort: {
          name: 'id',
          dir:  'asc'
        }
      }, data);

      // now click on the second button
      element.find('button[data-sort]:last').trigger('click');

      chai.assert.deepEqual({
        sort: {
          name: 'name',
          dir:  'desc'
        }
      }, data);
    });
  });

  describe('destroy', function() {
    it('removes the head', function() {
      tabularSort.destroy();
      chai.assert.equal('', table.html());
    });
  });
});