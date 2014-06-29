define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'club',
      [
        '$scope', 'Players',
        function ($scope, Players)
        {
          $scope.positions = config.app.positions;
          $scope.player = {};
          $scope.players = [];

          var players = $scope.$bus.channel('players');

          players.publish(
            {
              topic: 'player.list',
              data: {
                callback: function (list) { $scope.players = list }
              }
            }
          );

          $scope.savePlayer = function (player)
          {
            players.publish(
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
            players.publish(
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

          $scope.editPlayer = function (player) { $scope.player = angular.extend({}, player) };

          $scope.clearForm = function () { $scope.player = {} };


          $scope.promised = 'Loading promised..';

          players.request(
            {
              topic: "last.login",
              data: { userId: 8675309 },
              timeout: 5000
            }
          ).then(
            function (data)
            {
              $scope.promised = 'Last login for userId: ' + data.userId + ' occurred on ' + data.time;
            },
            function (err)
            {
              $scope.promised = 'Uh oh! Error: ' + err;
            }
          );
        }
      ]
    );
  });