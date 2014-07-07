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
    'postal-diagnostics',
    'postal-request-response',
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
                        configuration: postal.configuration,

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
                        subscriptions: postal.subscriptions,
                        unsubscribe: postal.unsubscribe,

                        linkChannels: postal.linkChannels,

                        // Not working!
                        // wiretaps: postal.wiretaps,

                        // promised
                        promise: {},
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