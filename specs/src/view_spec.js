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

  element, view;

  beforeEach(function() {
    element = $('<div id="tabular"/>').on('model:fetch', function(err) {
      element.trigger('model:success', data);
    });

    view = new tabular.View(element, {
      columns: [
        { title: 'Name', name: 'name' }
      ]
    });
  });

  afterEach(function() {
    view.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('should bind to model', function() {
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
  });

  describe('destroy', function() {
    it('removes table and event handlers', function() {
      chai.assert.isDefined($._data(element[0]).events['model:success']);
      view.destroy();
      chai.assert.isUndefined($._data(element[0]).events['model:success']);
    });
  });
});
