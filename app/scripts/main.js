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
    'controllers/home',
    'controllers/partial1',
    'controllers/partial2',
    'directives/appVersion',
    'filters/interpolate',
    'services/version',
    'services/user'
    // Any individual controller, service, directive or filter file
    // that you add will need to be pulled in here.
  ],
  function (angular, app, domReady, postal)
  {
    'use strict';

    // $('html').removeAttr('ng-app');

    app.config(
      [
        '$routeProvider', '$provide',
        function ($routeProvider, $provide)
        {
          $routeProvider
            .when(
            '/home',
            {
              templateUrl: 'views/home.html',
              controller: 'home'
            })
            .when(
            '/partial1',
            {
              templateUrl: 'views/partial1.html',
              controller: 'partial1'
            })
            .when(
            '/partial2',
            {
              templateUrl: 'views/partial2.html',
              controller: 'partial2'
            })
            .otherwise(
            {
              redirectTo: '/home'
            });


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

    domReady(
      function () { angular.bootstrap(document, ['MyApp']) }
    );

  }
);