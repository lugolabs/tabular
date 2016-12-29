describe('tabular.Model', function() {
  describe('fetching', function() {
    var options      = { source: '/data.json' },
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

    it('fetches data from server and triggers stopFetch event', function() {
      fetchFromServerAndTrigger('stopFetch');

      chai.assert.deepEqual(responseData, response);
    });

    it('fetches data from server and triggers success event', function() {
      fetchFromServerAndTrigger('success');

      chai.assert.deepEqual(responseData, response);
    });

    function fetchFromServerAndTrigger(event) {
      element.on('model:' + event, function(e, resp) {
        response = resp;
      });

      element.trigger('model:fetch');

      server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify([responseData])
      );
    }
  });
});
