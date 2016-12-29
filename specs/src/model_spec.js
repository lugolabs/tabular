describe('tabular.Model', function() {
  var options = { source: '/data.json' },
    element, model;

  beforeEach(function() {
    element = $('<div/>').appendTo($('body'));
    model   = new tabular.Model(element, options);
  });

  afterEach(function() {
    element.remove();
  });

  describe('constructor', function() {
    it('binds model:fetch event', function() {
      events = $._data(element[0]).events['model:fetch'];
      chai.assert.equal(1, events.length);
      chai.assert.equal('tabularModel', events[0].namespace);
    });
  });

  describe('fetching', function() {
    var metadata     = { page: 2 },
        responseData = { metadata: {}, data: [] },
        response, server;

    beforeEach(function() {
      server  = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    it('fetches data from server sending metadata and triggers stopFetch event', function() {
      fetchFromServerAndTrigger('stopFetch');
      chai.assert.deepEqual(responseData, response);
    });

    it('fetches data from server sending metadata and triggers success event', function() {
      fetchFromServerAndTrigger('success');
      chai.assert.deepEqual(responseData, response);
    });

    function fetchFromServerAndTrigger(event) {
      element.on('model:' + event, function(e, resp) {
        response = resp;
      });

      var url = options.source + '?' + $.param(metadata);
      server.respondWith('GET', url, [
        200,
        { "Content-Type": "application/json" },
        JSON.stringify([responseData])
      ]);

      element.trigger('model:fetch', metadata);
      server.respond();
    }
  });

  describe('destroy', function() {
    it('removes event handler', function() {
      model.destroy();

      chai.assert.isUndefined($._data(element[0]).events);
    });
  });
});
