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
      postal: '../vendors/postal.js/lib/postal.min',
      lodash: '../vendors/lodash/dist/lodash.min',
      conduitjs: '../vendors/conduitjs/lib/conduit.min'
    },
    shim: {
      angular: {
        deps: ['jquery'],
        exports: 'angular'
      },
      postal: {
        deps: ['lodash', 'conduitjs'],
        exports: 'postal'
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
    'run',
    'config',
    'controllers/club_controller',
    //'directives/appVersion',
    //'filters/interpolate',
    //'services/version',
    'services/event_bus',
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