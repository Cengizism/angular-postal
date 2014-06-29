if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config(
  {
    paths: {
      angular: '../vendors/angular/angular.min',
      jquery: '../vendors/jquery/jquery.min',
      bootstrap: '../vendors/bootstrap-sass/dist/js/bootstrap.min',
      domReady: '../vendors/requirejs-domready/domReady',
      underscore: '../vendors/underscore/underscore',
      lodash: '../vendors/lodash/dist/lodash.min',
      conduitjs: '../vendors/conduitjs/lib/conduit.min',
      postal: '../vendors/postal.js/lib/postal.min',
      'postal-diagnostics': '../vendors/postal.diagnostics/lib/postal.diagnostics.min',
      'postal-request-response': '../vendors/postal.request-response/lib/postal.request-response.min'
    },
    shim: {
      angular: { deps: ['jquery'], exports: 'angular' },
      bootstrap: { deps: ['jquery'], exports: 'bootstrap' },
      lodash: { deps: ['underscore'], exports: 'lodash' },
      postal: { deps: ['lodash', 'conduitjs'], exports: 'postal' },
      'postal-diagnostics': { deps: ['postal'] },
      'postal-request-response': { deps: ['postal'], exports: 'postal-request-response'}
    }
  }
);

require(
  [
    'angular',
    'app',
    'domReady',
    'postal',
    'postal-diagnostics',
    'postal-request-response',
    'bootstrap',
    'run',
    'config',
    'controllers/club',
    'services/players',
    'services/store'
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
                        subscribe: (function ()
                        {
                          var sub = postal.subscribe.apply(postal, arguments);

                          this.$on(
                            '$destroy',
                            function () { sub.unsubscribe() }
                          );
                        }).bind(this),
                        channel: postal.channel,
                        publish: postal.publish,
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

    domReady(function () { angular.bootstrap(document, ['ngEventBus']) });

  }
);