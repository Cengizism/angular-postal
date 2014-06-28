define(
  ['app'],
  function (app)
  {
    'use strict';

    app.run(
      [
        '$rootScope', 'eventBus',
        function($rootScope, eventBus)
        {
          eventBus.subscribe();
        }
      ]
    );
  }
);