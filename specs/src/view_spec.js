describe('tabular.View', function() {
  describe('constructor', function() {
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
      element.remove();
    });

    it('should bind to model', function() {
      chai.assert.equal('<table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>John</td></tr><tr><td>Mina</td></tr><tr><td>James</td></tr></tbody></table>',
        element.html());
    });
  });
});
