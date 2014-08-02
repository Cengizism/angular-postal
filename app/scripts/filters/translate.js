define(
  ['filters/filters'],
  function (filters)
  {
    'use strict';

    filters.filter(
      'translateTeamId',
      [
        function ()
        {
          return function (teams, id)
          {
            return (! _.isUndefined(id)) ?
                   ( _.find(teams, function (team) { return team.id == id }) ).name :
                   '- No team -';
          }
        }
      ]
    );
  }
);