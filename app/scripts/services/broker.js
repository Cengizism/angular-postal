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
          var players = $rootScope.$bus.channel('players');

          players.subscribe(
            {
              topic: 'player.list',
              callback: function (data, envelope) { data.callback(Player.list(), envelope) }
            }
          );

          players.subscribe(
            {
              topic: 'player.save',
              callback: function (data, envelope)
              {
                var result = Player.save(data);

                data.callback(result, envelope)
              }
            }
          )
            // .before(function () { console.log('before save action') })
            .after(function () { console.log('after save action ->', arguments[1]) })
            .catch(function (err) { console.log('error here ->', err) });

          players.subscribe(
            {
              topic: 'player.delete',
              callback: function (data, envelope)
              {
                var result = Player.remove(data);

                data.callback(result, envelope)
              }
            }
          );

          players.subscribe(
            {
              topic: 'player.block.save',
              callback: function ()
              {
                $rootScope.$bus.unsubscribe(saved);
              }
            }
          );

          players.subscribe(
            {
              topic: '*.save',
              callback: function (data, envelope) { /*console.log('player save action!', envelope)*/ }
            }
          );

          players.subscribe(
            {
              channel: 'players',
              topic: '*.delete',
              callback: function (data, envelope) { console.log('player delete action!', envelope) }
            }
          );










          /**
           * Promised stuff
           * @param userId
           * @returns {{userId: *, time: number}}
           */
          function getLoginInfo (userId)
          {
            return {
              userId: userId,
              time: Date.now()
            };
          }

          players.subscribe(
            "last.login",
            function (data, envelope)
            {
              var result = getLoginInfo(data.userId);

              $timeout(
                function ()
                {
                  envelope.reply(
                    {
                      time: result.time,
                      userId: data.userId,
                      envelope: envelope
                    }
                  );
                },
                4000
              );
            }
          );







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
                // console.log('this is from etsting ->', data, envelope);
              }
            }
          );

        }
      ]
    );
  }
);