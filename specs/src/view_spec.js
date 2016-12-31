describe('tabular.View', function() {
  var data = {
    metadata: {
      current_page:  1,
      total_pages:   4,
      total_entries: 10
    },
    data: [
      { name: 'John' },
      { name: 'Mina' },
      { name: 'James' }
    ]
  },

  element, view, tableHead;

  beforeEach(function() {
    element = $('<div id="tabular"/>')
      .on('model:fetch', function(err) {
        element.trigger('model:success', data);
      })
      .on('view:tableHead', function(e, head) {
        tableHead = head;
      });

    view = new tabular.View(element, {
      columns: [
        { title: 'Name', name: 'name' }
      ],
      className: 'custom'
    });
  });

  afterEach(function() {
    view.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('adds CSS classes', function() {
      chai.assert(element.hasClass('tabular'));
      chai.assert(element.hasClass('custom'));
    });

    it('renders correctly when fetching model', function() {
      var markup = [
        '<table>',
          '<thead>',
            '<tr>',
              '<th>Name</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            '<tr>',
              '<td>John</td>',
            '</tr>',
            '<tr>',
              '<td>Mina</td>',
            '</tr>',
            '<tr>',
              '<td>James</td>',
            '</tr>',
          '</tbody>',
        '</table>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it('exposes a head event', function() {
      chai.assert.equal('<tr><th>Name</th></tr>', tableHead.html());
    });
  });

  describe('destroy', function() {
    it('removes table and event handlers', function() {
      chai.assert.isDefined($._data(element[0]).events['model:success']);
      view.destroy();
      chai.assert.isUndefined($._data(element[0]).events['model:success']);
    });
  });
});
