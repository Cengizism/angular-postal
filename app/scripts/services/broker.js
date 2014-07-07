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
              $rootScope.broker = {
                setup: setup,
                channels: {},
                swap: {},
                logs: {}
              };

              $rootScope.$bus.configuration.DEFAULT_CHANNEL = '/';
              $rootScope.$bus.configuration.SYSTEM_CHANNEL = 'postal';
              $rootScope.$bus.configuration.promise.createDeferred = function () { return $q.defer() };
              $rootScope.$bus.configuration.promise.getPromise = function (deferred) { return deferred.promise };

              setup.hasOwnProperty('logs') && this.diagnostics(setup.logs);

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


                  //                  var teams = $rootScope.$bus.channel('teams');
                  //
                  //                  //                  teams.subscribe('team.list', Team.list);
                  //                  //                  teams.subscribe('team.save', Team.save);
                  //                  //                  teams.subscribe('team.remove', Team.remove);
                  //
                  //                  _.each(
                  //                    Team,
                  //                    function (callback, action)
                  //                    {
                  //                      teams.subscribe('teams.' + action, callback);
                  //                    }
                  //                  );


                  //                  var players = $rootScope.$bus.channel('players');
                  //
                  //                  _.each(
                  //                    Player,
                  //                    function (callback, action)
                  //                    {
                  //                      if (action == 'promised')
                  //                      {
                  //                        _.each(
                  //                          callback,
                  //                          function (internCb, internName)
                  //                          {
                  //                            players.subscribe('players.promised.' + internName, internCb);
                  //                          }
                  //                        )
                  //
                  //                      }
                  //                      else if (action == 'block')
                  //                      {
                  //                        _.each(
                  //                          callback,
                  //                          function (internCb, internName)
                  //                          {
                  //                            players.subscribe('players.block.' + internName, internCb);
                  //                          }
                  //                        )
                  //                      }
                  //                      else if (action == 'all')
                  //                      {
                  //                        _.each(
                  //                          callback,
                  //                          function (internCb, internName)
                  //                          {
                  //                            players.subscribe('*.' + internName, internCb);
                  //                          }
                  //                        )
                  //                      }
                  //                      else
                  //                      {
                  //                        if (_.isFunction(callback))
                  //                        {
                  //                          if (callback.hasOwnProperty('self'))
                  //                          {
                  //                            players.subscribe('players.' + action, callback.self);
                  //                          }
                  //                          else
                  //                          {
                  //                            players.subscribe('players.' + action, callback);
                  //                          }
                  //                        }
                  //                        else
                  //                        {
                  //                          var registered = players.subscribe('players.' + action, callback.self);
                  //
                  //                          _.each(
                  //                            callback,
                  //                            function (internCb, internName)
                  //                            {
                  //                              switch (internName)
                  //                              {
                  //                                case 'before':
                  //                                  registered.before(internCb);
                  //                                  break;
                  //                                case 'after':
                  //                                  registered.after(internCb);
                  //                                  break;
                  //                                case 'failed':
                  //                                  registered.catch(internCb);
                  //                                  break;
                  //                              }
                  //                            }
                  //                          );
                  //
                  //
                  //                        }
                  //                      }
                  //
                  //                    }
                  //                  );


                  // console.log('teams ->', $rootScope.$bus.subscriptions.teams);
                  // console.log('players ->', $rootScope.$bus.subscriptions.players);


                  //                  players.subscribe('player.list', Player.list);
                  //                  players.subscribe('player.list.promised', Player.listPromised);
                  //
                  //                  players.subscribe('player.save',Player.save)
                  //                    .before(Player.saveBefore)
                  //                    .after(Player.saveAfter)
                  //                    .catch(Player.saveError);
                  //
                  //                  players.subscribe('player.block.save', Player.blockSave);
                  //                  players.subscribe('*.save', Player.allSave);
                  //                  players.subscribe('player.remove', Player.remove);
                  //                  players.subscribe('*.remove', Player.allRemove);


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

                        $rootScope.broker.logs[name].list.unshift(
                          angular.extend(
                            angular.fromJson(message),
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