define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Team',
      [
        '$rootScope', 'Store',
        function ($rootScope, Store)
        {
          var store = {
            list: function () { return _.toArray(Store('teams').all()) },

            save: function (team)
            {
              var id = (team.id) ? team.id : Date.now();

              Store('teams').save(
                id,
                {
                  id: id,
                  name: (_.isUndefined(team.name)) ?
                        '- No name - ' + id :
                        team.name
                }
              );
            },

            remove: function (team) { Store('teams').remove(team.id) }
          };

          return {
            list: function (callback, envelope) { callback(store.list(), envelope) },
            save: function (data, envelope)
            {
              store.save(data.team);

              data.callback(envelope);
            },
            remove: function (data, envelope)
            {
              store.remove(data);

              data.callback(envelope)
            }
          };

        }
      ]
    );
  }
);