define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'teamsCtrl',
      [
        '$scope', '$timeout',
        function ($scope, $timeout)
        {
          $scope.team = {};
          $scope.teams = [];

          var teams = $scope.$bus.channel('teams');

          $scope.Team = {
            list: function ()
            {
              teams.publish(
                'teams.list',
                function (list) { $scope.teams = list }
              );
            },
            save: function (team)
            {
              teams.publish(
                {
                  topic: 'teams.save',
                  data: {
                    team: team,
                    callback: function () { this.list() }.bind(this)
                  }
                }
              );

              $scope.team = {};

              $scope.$bus.publish(
                {
                  channel: 'players',
                  topic: 'players.team.refresh'
                }
              )
            },
            remove: function (id)
            {
              teams.publish(
                {
                  topic: 'teams.remove',
                  data: {
                    id: id,
                    callback: function () { this.list() }.bind(this)
                  }
                }
              );
            },
            edit: function (team) { $scope.team = angular.extend({}, team) }
          };

          $timeout(function () { $scope.Team.list() });

          $scope.clearForm = function () { $scope.team = {} };
        }
      ]
    );
  }
);