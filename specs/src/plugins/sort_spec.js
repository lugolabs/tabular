describe('tabular.Sort', function() {
  var originalMarkup = [
      '<tr>',
        '<th>Id</th>',
        '<th>Name</th>',
      '</tr>'
    ].join(''),

    element, tableHead, tabularSort;

  beforeEach(function() {
    element     = $('<div/>').html('<table><thead>' + originalMarkup + '</thead></table>');
    tableHead   = element.find('thead');
    tabularSort = new tabular.Sort(element, {
      columns: [
        { name: 'id',   title: 'Id' },
        { name: 'name', title: 'Name', css: 'text-center' }
      ],
      sort: {
        name: 'name',
        dir:  'desc'
      }
    });
    element.trigger('view:tableHead', [tableHead]);
  });

  afterEach(function() {
    tabularSort.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('renders buttons in headings with a starting sort if specified', function() {
      var markup = [
        '<tr>',
          '<th class="tabular-sorting">',
            '<a href="#sort" data-sort="asc" data-column="id" class="tabular-sort">Id</a>',
          '</th>',
          '<th class="tabular-sorting text-center">',
            '<a href="#sort" data-sort="desc" data-column="name" class="tabular-sort tabular-sort-selected">Name</a>',
          '</th>',
        '</tr>'
      ].join('');
      chai.assert.equal(markup, tableHead.html());
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
    it('restores the original markup and removes event handlers', function() {
      chai.assert.equal(1, $._data(tableHead[0]).events.click.length);

      tabularSort.destroy();

      chai.assert.equal(originalMarkup, tableHead.html());
      chai.assert.isUndefined($._data(tableHead[0]).events);
    });
  });
});
