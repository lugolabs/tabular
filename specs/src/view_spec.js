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

    element, view, header, footer, tableHead, afterRender, requestData;

  beforeEach(function() {
    element = $('<div id="tabular"/>')
      .on('model:fetch', function(e, dt) {
        requestData = dt;
        element.trigger('model:success', data);
      })
      .on('view:header', function(e, el) {
        header = el;
      })
      .on('view:footer', function(e, el) {
        footer = el;
      })
      .on('view:tableHead', function(e, el) {
        tableHead = el;
      })
      .on('view:afterRender', function(e, dt) {
        afterRender = dt;
      });

    view = new tabular.View(element, {
      columns: [
        { title: 'Name', name: 'name', css: 'text-right' }
      ],
      tableClass:  'table',
      headerClass: 'my-header',
      footerClass: 'my-footer',
      sort: {
        name: 'name',
        dir:  'desc'
      }
    });
  });

  afterEach(function() {
    view.destroy();
    element.remove();
  });

  describe('constructor', function() {
    it('adds CSS classes', function() {
      chai.assert(element.hasClass('tabular'));
    });
  });

  describe('render', function() {
    it('renders correctly when fetching model', function() {
      var markup = [
        '<div class="tabular-header my-header"></div>',
        '<table class="table">',
          '<thead>',
            '<tr>',
              '<th class="text-right">Name</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            '<tr>',
              '<td class="text-right">John</td>',
            '</tr>',
            '<tr>',
              '<td class="text-right">Mina</td>',
            '</tr>',
            '<tr>',
              '<td class="text-right">James</td>',
            '</tr>',
          '</tbody>',
        '</table>',
        '<div class="tabular-footer my-footer"></div>'
      ].join('');
      chai.assert.equal(markup, element.html());
    });

    it('sends sort data', function() {
      chai.assert.deepEqual({
        sort: {
          name: 'name',
          dir:  'desc'
        }
      }, requestData);
    });

    it('exposes view:header event', function() {
      chai.assert(header.hasClass('tabular-header'));
    });

    it('exposes a head event', function() {
      chai.assert.equal('<tr><th class="text-right">Name</th></tr>', tableHead.html());
    });

    it('exposes afterRender event with response', function() {
      chai.assert.equal(data, afterRender);
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
