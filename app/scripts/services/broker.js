define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.service(
      'Broker',
      [
        '$rootScope', 'Player', '$timeout',
        function ($rootScope, Player, $timeout)
        {

          var callbacks = {
            players: {

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

          var players = $rootScope.$bus.channel('players');

          players.subscribe('player.list', callbacks.players.list);

          var saved = players.subscribe('player.save', callbacks.players.save.action)
            .before(callbacks.players.save.before)
            .after(callbacks.players.save.after)
            .catch(callbacks.players.save.error);

          players.subscribe('player.remove', callbacks.players.remove);
          players.subscribe('player.block.save', callbacks.players.block.save);
          // players.subscribe('*.save', callbacks.players.all.save);
          // players.subscribe('*.remove', callbacks.players.all.remove);





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

        }
      ]
    );
  }
);