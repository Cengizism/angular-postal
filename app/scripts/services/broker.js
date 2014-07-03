define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.service(
      'Broker',
      [
        '$rootScope', '$q', '$timeout', 'Diagnostics', 'Player', 'Team',
        function ($rootScope, $q, $timeout, Diagnostics, Player, Team)
        {

          return {

            initialize: function ()
            {
              $rootScope.$bus.configuration.DEFAULT_CHANNEL = '/';
              $rootScope.$bus.configuration.SYSTEM_CHANNEL = 'postal';
              $rootScope.$bus.configuration.promise.createDeferred = function () { return $q.defer() };
              $rootScope.$bus.configuration.promise.getPromise = function (deferred) { return deferred.promise };

              /**
               * Here comes the subscriptions
               */
              $timeout(
                function ()
                {
                  var teams = $rootScope.$bus.channel('teams');

                  teams.subscribe(
                    'team.list',
                    function (callback, envelope) { callback(Team.list(), envelope) }
                  );

                  teams.subscribe(
                    'team.save',
                    function (data, envelope)
                    {
                      Team.save(data.team);

                      data.callback(envelope);
                    }
                  );

                  teams.subscribe(
                    'team.remove',
                    function (data, envelope)
                    {
                      Team.remove(data);

                      data.callback(envelope)
                    }
                  );

                  var players = $rootScope.$bus.channel('players');

                  players.subscribe(
                    'player.list',
                    function (callback, envelope) { callback(Player.list(), envelope) }
                  );

                  players.subscribe(
                    'player.list.promised',
                    function (data, envelope)
                    {
                      $timeout(
                        function () { envelope.reply({ list: Player.list() }) },
                        1
                      );
                    }
                  );

                  var saved = players.subscribe(
                    'player.save',
                    function (data, envelope)
                    {
                      Player.save(data.player);

                      data.callback(envelope);
                    }
                  ).before(function (next, data, envelope) { next(data, envelope) })
                    .after(function () { /*console.log('after save action ->', arguments[1])*/ })
                    .catch(function (err) { /*console.log('error here ->', err)*/ });

                  players.subscribe(
                    'player.block.save',
                    function () { $rootScope.$bus.unsubscribe(saved) }
                  );

                  players.subscribe(
                    '*.save',
                    function (data, envelope) { /*console.log('player save action!', envelope)*/ }
                  );

                  players.subscribe(
                    'player.remove',
                    function (data, envelope)
                    {
                      Player.remove(data);

                      data.callback(envelope)
                    }
                  );

                  players.subscribe(
                    '*.remove',
                    function (data, envelope) { /*console.log('player delete action!', envelope)*/ }
                  );


                  /**
                   * ---------------------------------------------------------------------------------
                   */

                  /**
                   * Linking channels
                   */
                  var testing = $rootScope.$bus.channel('testing');

                  $rootScope.$bus.linkChannels(
                    {
                      channel: 'players',
                      topic: 'player.list'
                    },
                    {
                      channel: 'testing',
                      topic: 'tested.method'
                    }
                  );

                  testing.subscribe(
                    {
                      topic: 'tested.method',
                      callback: function (data, envelope)
                      {
                        // console.log('this is from testing ->', data, envelope);
                      }
                    }
                  );


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