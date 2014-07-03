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
                'team.list',
                function (list) { $scope.teams = list }
              );
            },
            save: function (team)
            {
              teams.publish(
                {
                  topic: 'team.save',
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
                  topic: 'player.team.list'
                }
              )
            },
            remove: function (id)
            {
              teams.publish(
                {
                  topic: 'team.remove',
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
  });