define(
  ['services/services'],
  function (services)
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
              $rootScope.$bus.configuration.DEFAULT_CHANNEL = '/';
              $rootScope.$bus.configuration.SYSTEM_CHANNEL = 'postal';
              $rootScope.$bus.configuration.promise.createDeferred = function () { return $q.defer() };
              $rootScope.$bus.configuration.promise.getPromise = function (deferred) { return deferred.promise };

              $rootScope.broker = {
                setup: setup,
                channels: {},
                swap: {},
                logs: {
                  system: [
                    { channel: $rootScope.$bus.configuration.SYSTEM_CHANNEL }
                  ]
                }
              };

              setup.hasOwnProperty('logs') && this.diagnostics(angular.extend(setup.logs, $rootScope.broker.logs));

              $timeout(
                function ()
                {
                  _.each(
                    setup.modules,
                    function (modal, id)
                    {
                      $rootScope.broker.channels[id] = $rootScope.$bus.channel(id);

                      $rootScope.broker.swap[id] = {};

                      _.each(
                        modal,
                        function (callback, action)
                        {
                          switch (action)
                          {
                            case 'promised':
                              _.each(
                                callback,
                                function (cb, key) { this.register(id, id + '.promised.' + key, cb) }.bind(this)
                              );
                              break;

                            case 'all':
                              _.each(
                                callback,
                                function (cb, key) { this.register(id, '*.' + key, cb) }.bind(this)
                              );
                              break;

                            default:
                              if (_.isFunction(callback))
                              {
                                this.register(
                                  id,
                                  id + '.' + action,
                                  (callback.hasOwnProperty('self')) ? callback.self : callback
                                );
                              }
                              else
                              {
                                this.register(id, id + '.' + action, callback.self);

                                _.each(
                                  callback,
                                  function (internCb, internName)
                                  {
                                    var event = id + '.' + action;

                                    switch (internName)
                                    {
                                      case 'before':
                                        $rootScope.broker.swap[id][event].before(internCb);
                                        break;
                                      case 'after':
                                        $rootScope.broker.swap[id][event].after(internCb);
                                        break;
                                      case 'failed':
                                        $rootScope.broker.swap[id][event].catch(internCb);
                                        break;
                                    }
                                  }
                                );
                              }
                          }
                        }.bind(this)
                      );
                    }.bind(this)
                  );


                  /**
                   * ---------------------------------------------------------------------------------
                   */

                  //                  /**
                  //                   * Linking channels
                  //                   */
                  //                  var testing = $rootScope.$bus.channel('testing');
                  //
                  //                  $rootScope.$bus.linkChannels(
                  //                    {
                  //                      channel: 'players',
                  //                      topic: 'player.list'
                  //                    },
                  //                    {
                  //                      channel: 'testing',
                  //                      topic: 'tested.method'
                  //                    }
                  //                  );
                  //
                  //                  testing.subscribe(
                  //                    {
                  //                      topic: 'tested.method',
                  //                      callback: function (data, envelope)
                  //                      {
                  //                        // console.log('this is from testing ->', data, envelope);
                  //                      }
                  //                    }
                  //                  );

                }.bind(this)
              );
            },

            register: function (id, event, callback)
            {
              $rootScope.broker.swap[id][event] = $rootScope.broker.channels[id].subscribe(event, callback);
            },

            disable: function (channel, event)
            {
              $rootScope.$bus.unsubscribe($rootScope.$bus.subscriptions[channel][event][0]);
            },

            enable: function (channel, event)
            {
              var subscription = $rootScope.broker.swap[channel][event];

              $rootScope.$bus.subscriptions[channel][event].push(subscription);
            },

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

                  $rootScope.broker.logs[name].self = new $rootScope.$bus.diagnostics(
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

                        log.auth = !((log.channel != $rootScope.$bus.configuration.SYSTEM_CHANNEL &&
                                     $rootScope.$bus.subscriptions[log.channel][log.topic].length == 0));

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
            }

          };
        }
      ]
    );
  }
);