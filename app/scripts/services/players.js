define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Players',
      [
        '$rootScope', 'Store', '$timeout',
        function ($rootScope, Store, $timeout)
        {
          var players = $rootScope.$bus.channel('players');

          players.subscribe(
            {
              topic: 'player.list',
              callback: function (data, envelope)
              {
                var list = Store.get();

                if (_.isUndefined(list)) Store.set([]);

                data.callback(list || [], envelope);
              }
            }
          );

          players.subscribe(
            {
              topic: 'player.save',
              callback: function (data)
              {
                data.player.goals = (_.isUndefined(data.player.goals)) ? 0 : data.player.goals;

                var players = Store.get();

                if (data.player.id)
                {
                  var index = _.indexOf(
                    players, _.find(
                      players,
                      function (_player) { return _player.id == data.player.id }
                    )
                  );

                  players[index] = data.player;
                }
                else
                {
                  players.push(
                    {
                      id: Date.now(),
                      name: data.player.name,
                      position: data.player.position,
                      goals: data.player.goals
                    }
                  );
                }

                Store.set(players);

                data.callback(players);
              }
            }
          );

          players.subscribe(
            {
              topic: 'player.delete',
              callback: function (data)
              {
                Store.set(
                  _.filter(
                    Store.get(),
                    function (player) { return player.id != data.id }
                  )
                );

                data.callback(Store.get());
              }
            }
          );

          players.subscribe(
            {
              topic: '*.save',
              callback: function () { console.log('player save action!') }
            }
          );

          players.subscribe(
            {
              channel: 'players',
              topic: '*.delete',
              callback: function () { console.log('player delete action!') }
            }
          );


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
                  envelope.reply({ time: result.time, userId: data.userId });
                },
                4000
              );
            }
          );

          console.log('version ->', _.VERSION);

        }
      ]
    );
  }
);