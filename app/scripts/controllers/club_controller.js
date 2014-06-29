define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'clubController',
      [
        '$scope',
        function ($scope)
        {
          $scope.positions = config.app.positions;
          $scope.player = {};
          $scope.players = [];

          $scope.$bus.publish(
            {
              channel: 'players',
              topic: 'player.list',
              data: {
                callback: function (list) { $scope.players = list }
              }
            }
          );

          $scope.savePlayer = function (player)
          {
            $scope.$bus.publish(
              {
                channel: 'players',
                topic: 'player.save',
                data: {
                  player: player,
                  callback: function (list) { $scope.players = list }
                }
              }
            );

            $scope.player = {};
          };

          $scope.deletePlayer = function (id)
          {
            $scope.$bus.publish(
              {
                channel: 'players',
                topic: 'player.delete',
                data: {
                  id: id,
                  callback: function (list) { $scope.players = list }
                }
              }
            );
          };

          $scope.editPlayer = function (player) { $scope.player = player };

          $scope.clearForm = function () { $scope.player = {} };
        }
      ]
    );
  }
);