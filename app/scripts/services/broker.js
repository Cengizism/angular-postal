define(
  ['services/services', 'postal', 'diagnostics'],
  function (services, postal, diagnostics)
  {
    'use strict';

    services.service(
      'Broker',
      [
        '$rootScope', '$q', '$timeout',
        function ($rootScope, $q, $timeout)
        {
          return {
            initialize: function (setup)
            {
              this.setup = setup;

              postal.configuration.DEFAULT_CHANNEL = '/';
              postal.configuration.SYSTEM_CHANNEL = 'postal';
              postal.configuration.promise.createDeferred = function () { return $q.defer() };
              postal.configuration.promise.getPromise = function (deferred) { return deferred.promise };

              $rootScope.broker = {
                setup: this.setup,
                channels: {},
                swap: {},
                logs: {
                  system: [
                    { channel: postal.configuration.SYSTEM_CHANNEL }
                  ],
                  actions: []
                }
              };

              _.each(
                this.setup.logs,
                function (log) { $rootScope.broker.logs.actions.push({ channel: log }) }
              );

              this.setup.hasOwnProperty('logs') && this.diagnostics($rootScope.broker.logs);

              this.build();
            },

            build: function ()
            {
              $timeout(
                function ()
                {
                  _.each(
                    this.setup.modules,
                    function (modal, channel)
                    {
                      $rootScope.broker.channels[channel] = $rootScope.$bus.channel(channel);

                      $rootScope.broker.swap[channel] = {};

                      _.each(
                        modal,
                        function (callback, action)
                        {
                          var key = Object.keys(callback)[0];

                          var details = {
                            event: '',
                            callback: callback[key]
                          };

                          switch (action)
                          {
                            case 'promised':
                              details.event = channel + '.promised.' + key;
                              break;

                            case 'all':
                              details.event = '*.' + key;
                              break;

                            default:
                              details = {
                                event: channel + '.' + action,
                                callback: (_.isFunction(callback)) ?
                                          ((callback.hasOwnProperty('self')) ? callback.self : callback) :
                                          callback.self
                              };
                          }

                          this.register(channel, details.event, details.callback);

                          if (! _.isFunction(callback))
                          {
                            _.each(
                              callback,
                              function (callback, stack)
                              {
                                var subscription = $rootScope.broker.swap[channel][details.event];

                                switch (stack)
                                {
                                  case 'before':
                                    subscription.before(callback);
                                    break;
                                  case 'after':
                                    subscription.after(callback);
                                    break;
                                  case 'failed':
                                    subscription.catch(callback);
                                    break;
                                }
                              }
                            );
                          }
                        }.bind(this)
                      );
                    }.bind(this)
                  );
                }.bind(this)
              );
            },

            subscriptions: (function () { return postal.subscriptions })(),

            register: function (channel, event, callback)
            {
              $rootScope.broker.swap[channel][event] = $rootScope.broker.channels[channel].subscribe(event, callback);

              $rootScope.broker.swap[channel][event].auth = true;
            },

            disable: function (channel, event) { postal.unsubscribe(this.subscriptions[channel][event][0]) },

            enable: function (channel, event)
            {
              var subscription = $rootScope.broker.swap[channel][event];

              this.subscriptions[channel][event].push(subscription);
            },

            reset: function () { postal.reset() },

            link: function (original, target) { postal.linkChannels(original, target) },

            diagnostics: function (logs)
            {
              $rootScope.broker.logs = {};

              _.each(
                logs,
                function (filters, name)
                {
                  if (_.isUndefined($rootScope.broker.logs[name]))
                  {
                    $rootScope.broker.logs[name] = {};
                  }

                  $rootScope.broker.logs[name].self = new diagnostics(
                    {
                      name: name,
                      filters: filters,
                      writer: function (message)
                      {
                        if (_.isUndefined($rootScope.broker.logs[name].list))
                        {
                          $rootScope.broker.logs[name].list = [];
                        }

                        var log = angular.fromJson(message);

                        log.auth = ! ((log.channel != postal.configuration.SYSTEM_CHANNEL &&
                                       postal.subscriptions[log.channel][log.topic].length == 0));

                        $rootScope.broker.logs[name].list.unshift(
                          angular.extend(
                            log,
                            { fold: false }
                          )
                        );
                      }
                    }
                  )
                }
              );
            },

            tap: function ()
            {
              /**
               * Add a wiretap
               */
              //                var tap = postal.addWireTap(
              //                  function (data, envelope) { console.log('wired: ', JSON.stringify(envelope)) }
              //                );
              // Remove the tap
              // tap();
            }
          };
        }
      ]
    );
  }
);