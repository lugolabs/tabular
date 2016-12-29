describe('tabular.Model', function() {
  describe('fetching', function() {
    var metadata     = { page: 2 },
        options      = { source: '/data.json' },
        responseData = { metadata: {}, data: [] },
        element, response, model, server;

    beforeEach(function() {
      element = $('<div/>');
      model   = new tabular.Model(element, options);
      server  = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
      element.remove();
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
});
