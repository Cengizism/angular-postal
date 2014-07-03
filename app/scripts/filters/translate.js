define(
  ['filters/filters', 'config'],
  function (filters, config)
  {
    'use strict';

    filters.filter(
      'translateTeamId',
      [
        function ()
        {
          return function (teams, id)
          {
            return (_.find(
              teams,
              function (team) { return team.id == id }
            )).name;
          }
        }
      ]
    );
  }
);