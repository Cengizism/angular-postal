if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config(
  {
    paths: {
      angular: '../vendors/angular/angular',
      jquery: '../vendors/jquery/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady',
      lodash: '../vendors/lodash/dist/lodash.min',
      conduitjs: '../vendors/conduitjs/lib/conduit.min',
      postal: '../vendors/postal.js/lib/postal.min',
      'postal-diagnostics': '../vendors/postal.diagnostics/lib/postal.diagnostics.min'
    },
    shim: {
      angular: {
        deps: ['jquery'],
        exports: 'angular'
      },
      postal: {
        deps: ['lodash', 'conduitjs'],
        exports: 'postal'
      },
      'postal-diagnostics': {
        deps: ['postal']
      }
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
    'run',
    'config',
    'controllers/club_controller',
    //'directives/appVersion',
    //'filters/interpolate',
    //'services/version',
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
                      var self = this;

                      return {
                        subscribe: function ()
                        {
                          var sub = postal.subscribe.apply(postal, arguments);

                          self.$on(
                            '$destroy',
                            function () { sub.unsubscribe() }
                          );
                        },
                        channel: postal.channel,
                        publish: postal.publish
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