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
              '<a href="#sort" data-sort="asc" data-column="id" class="tabular-sort">Id</a>',
            '</th>',
            '<th class="tabular-sorting">',
              '<a href="#sort" data-sort="asc" data-column="name" class="tabular-sort">Name</a>',
            '</th>',
          '</tr>',
        '</thead>'
      ].join('');
      chai.assert.equal(markup, table.html());
    });
  });

  describe('events', function() {
    it('sends sort to model when clicking on sorting buttons', function() {
      var firstButton = element.find('a[data-sort]:first'),
          lastButton  = element.find('a[data-sort]:last'),
          data;

      element.on('model:fetch', function(e, dt) {
        data = dt;
      });

      chai.assert(!firstButton.hasClass(tabular.Sort.SELECTED_CLASS));

      firstButton.trigger('click');

      chai.assert.equal('asc', tabularSort.getSortingDirection(firstButton));
      chai.assert.deepEqual({
        sort: {
          name: 'id',
          dir:  'asc'
        }
      }, data);

      // now click on the other direction
      firstButton.trigger('click');

      chai.assert.equal('desc', tabularSort.getSortingDirection(firstButton));
      chai.assert(firstButton.hasClass(tabular.Sort.SELECTED_CLASS));
      chai.assert.deepEqual({
        sort: {
          name: 'id',
          dir:  'desc'
        }
      }, data);

      // now click on the last button
      lastButton.trigger('click');

      chai.assert.equal('asc', tabularSort.getSortingDirection(firstButton));
      chai.assert(!firstButton.hasClass(tabular.Sort.SELECTED_CLASS));

      chai.assert.equal('asc', tabularSort.getSortingDirection(lastButton));
      chai.assert(lastButton.hasClass(tabular.Sort.SELECTED_CLASS));
      chai.assert.deepEqual({
        sort: {
          name: 'name',
          dir:  'asc'
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
