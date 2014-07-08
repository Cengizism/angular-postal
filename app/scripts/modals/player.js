define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Player',
      [
        '$rootScope', '$timeout', 'Store',
        function ($rootScope, $timeout, Store)
        {
          var store = {
            list: function () { return _.toArray(Store('players').all()) },

            save: function (player)
            {
              var id = (player.id) ? player.id : Date.now();

              var _player = {
                id: id,
                name: (_.isUndefined(player.name)) ? '- No name - ' + id : player.name,
                position: (_.isUndefined(player.position)) ? '- No position -' : player.position,
                goals: (_.isUndefined(player.goals)) ? 0 : player.goals
              };

              if (player.hasOwnProperty('team') && ! _.isNull(player.team))
              {
                _player.team = player.team;
              }

              Store('players').save(
                id,
                _player
              );
            },

            remove: function (player) { Store('players').remove(player.id) }
          };

          return {

            list: function (callback, envelope) { callback(store.list(), envelope) },

            save: {
              self: function (data, envelope)
              {
                store.save(data.player);

                data.callback(envelope);
              },
              before: function (next, data, envelope)
              {
                console.log('before save action ->', data);

                next(data, envelope);
              },
              after: function () { console.log('after save action ->', arguments[1]) },
              failed: function (err) { console.log('error here ->', err) }
            },

            remove: function (data, envelope)
            {
              store.remove(data);

              data.callback(envelope)
            },

            promised: {
              list: function (data, envelope)
              {
                $timeout(
                  function ()
                  {
                    envelope.reply(
                      {
                        list: store.list(),
                        envelope: envelope
                      }
                    )
                  },
                  10
                );
              }
            },

            all: {
              save: function (data, envelope) { console.log('player save action!', envelope) },
              remove: function (data, envelope) { console.log('player delete action!', envelope) }
            }
          };

        }
      ]
    );
  }
);