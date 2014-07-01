define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'teams',
      [
        '$scope', 'Broker',
        function ($scope, Broker)
        {

          $scope.team = {};
          $scope.teams = [];

          var teams = $scope.$bus.channel('teams');

          teams.publish(
            {
              topic: 'team.list',
              data: {
                callback: function (list) { $scope.teams = list }
              }
            }
          );

          $scope.saveTeam = function (team)
          {
            teams.publish(
              {
                topic: 'team.save',
                data: {
                  player: team,
                  callback: function (list) { $scope.teams = list }
                }
              }
            );

            $scope.team = {};
          };

          $scope.deleteTeam = function (id)
          {
            teams.publish(
              {
                topic: 'team.delete',
                data: {
                  id: id,
                  callback: function (list) { $scope.teams = list }
                }
              }
            );
          };

          $scope.editTeam = function (team) { $scope.team = angular.extend({}, team) };

          $scope.clearForm = function () { $scope.team = {} };






        }
      ]
    );
  });