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
      'postal-diagnostics': '../vendors/postal.diagnostics/lib/postal.diagnostics.min',
      'postal-request-response': '../vendors/postal.request-response/lib/postal.request-response.min'
    },
    shim: {
      angular: { deps: ['jquery'], exports: 'angular' },
      bootstrap: { deps: ['jquery'], exports: 'bootstrap' },
      lawnchair: { deps: [], exports: 'lawnchair' },
      dom: { deps: ['lawnchair'], exports: 'dom' }
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
    'lawnchair',
    'dom',
    'run',
    'config',

    'modals/player',

    'controllers/teams',
    'controllers/players',

    'services/broker',
    'services/_store',
    'services/store',
    'directives/logs',
    'services/diagnostics'
  ],
  function (angular, app, domReady, postal, DiagnosticsWireTap)
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
                /**
                 * Some configuration options
                 * @type {string}
                 */
                postal.configuration.DEFAULT_CHANNEL = '/';
                postal.configuration.SYSTEM_CHANNEL = 'postal';


                /**
                 * Channel definition instance
                 * @type {_postal.ChannelDefinition}
                 */
                //                var chn = new postal.ChannelDefinition();
                //                console.log('chn ->', chn);


                /**
                 * Add a wiretap
                 */
                  //                var tap = postal.addWireTap(
                  //                  function (data, envelope) { console.log('wired: ', JSON.stringify(envelope)) }
                  //                );
                  // Remove the tap
                  // tap();


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
                        subscriptions: postal.subscriptions,
                        unsubscribe: postal.unsubscribe,
                        linkChannels: postal.linkChannels,
                        wiretaps: postal.wiretaps,
                        // promised
                        request: postal.request,
                        // diagnostics
                        diagnostics: DiagnosticsWireTap
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