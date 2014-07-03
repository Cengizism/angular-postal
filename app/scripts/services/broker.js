define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.service(
      'Broker',
      [
        '$rootScope', '$q', '$timeout', 'Player', 'Team',
        function ($rootScope, $q, $timeout, Player, Team)
        {
          return {

            initialize: function (setup)
            {
              $rootScope.$bus.configuration.DEFAULT_CHANNEL = '/';
              $rootScope.$bus.configuration.SYSTEM_CHANNEL = 'postal';
              $rootScope.$bus.configuration.promise.createDeferred = function () { return $q.defer() };
              $rootScope.$bus.configuration.promise.getPromise = function (deferred) { return deferred.promise };

              setup.hasOwnProperty('logs') && this.diagnostics(setup.logs);

              // var modals = ['Team'];

              $timeout(
                function ()
                {


                  var teams = $rootScope.$bus.channel('teams');

                  //                  teams.subscribe('team.list', Team.list);
                  //                  teams.subscribe('team.save', Team.save);
                  //                  teams.subscribe('team.remove', Team.remove);

                  _.each(
                    Team,
                    function (callback, action)
                    {
                      teams.subscribe('team.' + action, callback);
                    }
                  );

//                  console.log('toString ->', Player.keys());

                  var players = $rootScope.$bus.channel('players');

                  _.each(
                    Player,
                    function (callback, action)
                    {
                      if (action == 'promised')
                      {
                        _.each(
                          callback,
                          function (internCb, internName)
                          {
                            players.subscribe('player.promised.' + internName, internCb);
                          }
                        )

                      }
                      else if (action == 'block')
                      {
                        _.each(
                          callback,
                          function (internCb, internName)
                          {
                            players.subscribe('player.block.' + internName, internCb);
                          }
                        )
                      }
                      else if (action == 'all')
                      {
                        _.each(
                          callback,
                          function (internCb, internName)
                          {
                            players.subscribe('*.' + internName, internCb);
                          }
                        )
                      }
                      else
                      {
                        if (_.isFunction(callback))
                        {
                          if (callback.hasOwnProperty('self'))
                          {
                            players.subscribe('player.' + action, callback.self);
                          }
                          else
                          {
                            players.subscribe('player.' + action, callback);
                          }
                        }
                        else
                        {
                          var registered = players.subscribe('player.' + action, callback.self);

                          _.each(
                            callback,
                            function (internCb, internName)
                            {
                              switch (internName)
                              {
                                case 'before':
                                  registered.before(internCb)
                                  break;
                                case 'after':
                                  registered.after(internCb)
                                  break;
                                case 'failed':
                                  registered.catch(internCb)
                                  break;
                              }
                            }
                          );


                        }
                      }

                    }
                  );


                  // console.log('teams ->', $rootScope.$bus.subscriptions.teams);
                  console.log('players ->', $rootScope.$bus.subscriptions.players);


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


                }
              );

            },

            diagnostics: function (logs)
            {
              $rootScope.logs = {};

              _.each(
                logs,
                function (filters, name)
                {
                  if (_.isUndefined($rootScope.logs[name]))
                  {
                    $rootScope.logs[name] = {};
                  }

                  $rootScope.logs[name].self = new $rootScope.$bus.diagnostics(
                    {
                      name: name,
                      filters: filters,
                      writer: function (message)
                      {
                        if (_.isUndefined($rootScope.logs[name].list))
                        {
                          $rootScope.logs[name].list = [];
                        }

                        $rootScope.logs[name].list.unshift(
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