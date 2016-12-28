describe('tabular.View', function(){
  describe('constructor', function(){
    it('should bind to model', function() {
      var element = $('<div id="tabular"/>'),
        view = new tabular.View(element, {
          columns: [
            { title: 'Name', name: 'name' }
          ]
        }),
        data = {
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
        };

      element.trigger('model:success', data);
      chai.assert.equal('<table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>John</td></tr><tr><td>Mina</td></tr><tr><td>James</td></tr></tbody></table>',
        element.html());

      // chai.assert.equal(element.prop('id'), tabular.start(element[0]).prop('id'));
    });
  });
});
