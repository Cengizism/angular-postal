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

          var saved = players.subscribe(
            {
              topic: 'player.save',
              callback: function (data, envelope)
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

                // throw 'Some error value';

                data.callback(players, envelope);
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

//          saved.before(
//            function ()
//            {
//              console.log('before save action');
//            }
//          );

          saved.after(
            function ()
            {
              console.log('after save action ->', arguments[1]);
            }
          );

          saved.catch(
            function (err)
            {
              console.log('error here ->', err);
            }
          );


          players.subscribe(
            {
              topic: 'player.delete',
              callback: function (data, envelope)
              {
                Store.set(
                  _.filter(
                    Store.get(),
                    function (player) { return player.id != data.id }
                  )
                );

                data.callback(Store.get(), envelope);
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