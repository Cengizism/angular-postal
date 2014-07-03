define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.service(
      'Broker',
      [
        '$rootScope', 'Player', 'Team', '$timeout',
        function ($rootScope, Player, Team, $timeout)
        {

          var callbacks = {
            team: {

              list: function (callback, envelope) { callback(Team.list(), envelope) },

              save: {
                action: function (data, envelope)
                {
                  Team.save(data.team);

                  data.callback(envelope);
                }
              },

              remove: function (data, envelope)
              {
                Team.remove(data);

                data.callback(envelope)
              }
            },
            player: {

              list: function (callback, envelope) { callback(Player.list(), envelope) },

              save: {
                before: function (next, data, envelope) { next(data, envelope) },
                action: function (data, envelope)
                {
                  Player.save(data.player);

                  data.callback(envelope);
                },
                after: function () { /*console.log('after save action ->', arguments[1])*/ },
                error: function (err) { /*console.log('error here ->', err)*/ }
              },

              remove: function (data, envelope)
              {
                Player.remove(data);

                data.callback(envelope)
              },

              block: {
                save: function () { $rootScope.$bus.unsubscribe(saved) }
              },

              all: {
                save: function (data, envelope) { /*console.log('player save action!', envelope)*/ },
                remove: function (data, envelope) { /*console.log('player delete action!', envelope)*/ }
              }
            }
          };



          //          /**
          //           * Promised stuff
          //           * @param userId
          //           * @returns {{userId: *, time: number}}
          //           */
          //          function getLoginInfo (userId)
          //          {
          //            return {
          //              userId: userId,
          //              time: Date.now()
          //            };
          //          }
          //
          //          players.subscribe(
          //            "last.login",
          //            function (data, envelope)
          //            {
          //              var result = getLoginInfo(data.userId);
          //
          //              $timeout(
          //                function ()
          //                {
          //                  envelope.reply(
          //                    {
          //                      time: result.time,
          //                      userId: data.userId,
          //                      envelope: envelope
          //                    }
          //                  );
          //                },
          //                4000
          //              );
          //            }
          //          );

          //          /**
          //           * Linking channels
          //           */
          //          var testing = $rootScope.$bus.channel('testing');
          //
          //          $rootScope.$bus.linkChannels(
          //            {
          //              channel: 'players',
          //              topic: 'player.list'
          //            },
          //            {
          //              channel: 'testing',
          //              topic: 'tested.method'
          //            }
          //          );
          //
          //          testing.subscribe(
          //            {
          //              topic: 'tested.method',
          //              callback: function (data, envelope)
          //              {
          //                console.log('this is from testing ->', data, envelope);
          //              }
          //            }
          //          );



          return {
            initialize: function ()
            {
              $timeout(
                function ()
                {
                  var teams = $rootScope.$bus.channel('teams');

                  teams.subscribe('team.list', callbacks.team.list);

                  teams.subscribe('team.save', callbacks.team.save.action);

                  teams.subscribe('team.remove', callbacks.team.remove);



                  var players = $rootScope.$bus.channel('players');

                  players.subscribe('player.list', callbacks.player.list);

                  players.subscribe('player.save', callbacks.player.save.action)
                    .before(callbacks.player.save.before)
                    .after(callbacks.player.save.after)
                    .catch(callbacks.player.save.error);

                  players.subscribe('player.remove', callbacks.player.remove);
                  players.subscribe('player.block.save', callbacks.player.block.save);
                  // players.subscribe('*.save', callbacks.player.all.save);
                  // players.subscribe('*.remove', callbacks.player.all.remove);
                }
              )
            }
          };

        }
      ]
    );
  }
);