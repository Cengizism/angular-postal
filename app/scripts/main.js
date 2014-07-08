// Needed for making e2e test working.
if (window.location.port == '8080') document.getElementsByTagName('html')[0].setAttribute('ng-app');

require.config(
  {
    paths: {
      angular: '../vendors/angular/angular.min',
      jquery: '../vendors/jquery/jquery.min',
      bootstrap: '../vendors/bootstrap-sass/dist/js/bootstrap.min',
      domReady: '../vendors/requirejs-domready/domReady',
      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      dom: '../vendors/lawnchair/src/adapters/dom',
      // Load underscore because 'postal-request-response' complains about it in absence
      underscore: '../vendors/underscore/underscore',
      lodash: '../vendors/lodash/dist/lodash.min',
      conduitjs: '../vendors/conduitjs/lib/conduit.min',
      postal: '../vendors/postal.js/lib/postal.min',
      diagnostics: '../vendors/postal.diagnostics/lib/postal.diagnostics.min',
      request: '../vendors/postal.request-response/lib/postal.request-response.min'
    },
    shim: {
      angular: { deps: ['jquery'], exports: 'angular' },
      bootstrap: { deps: ['jquery'], exports: 'bootstrap' },
      dom: { deps: ['lawnchair'] }
    }
  }
);

require(
  [
    'angular',
    'app',
    'domReady',
    'postal',
    'diagnostics',
    'request',
    'bootstrap',
    'lawnchair',
    'dom',
    'run',
    'config',
    'services/broker',
    'modals/player',
    'modals/team',
    'controllers/teamsCtrl',
    'controllers/playersCtrl',
    'services/store',
    'directives/logs',
    'filters/translate'
  ],
  function (angular, app, domReady, postal)
  {
    'use strict';

    app.config(
      [
        '$provide',
        function ($provide)
        {
          $provide.decorator(
            '$rootScope',
            [
              '$delegate',
              function ($delegate)
              {
                Object.defineProperty(
                  $delegate.constructor.prototype,
                  '$bus',
                  {
                    get: function ()
                    {
                      return {
                        subscribe: function ()
                        {
                          var sub = postal.subscribe.apply(postal, arguments);

                          this.$on(
                            '$destroy',
                            function () { sub.unsubscribe() }
                          );
                        }.bind(this),
                        channel: postal.channel,
                        publish: postal.publish,
                        unsubscribe: postal.unsubscribe,
                        link: postal.linkChannels,
                        promise: {},
                        request: postal.request
                      };
                    },
                    enumerable: false
                  }
                );

                return $delegate;
              }
            ]
          );
        }
      ]
    );

    domReady(function () { angular.bootstrap(document, ['ngPostal']) });
  }
);