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

          $scope.players = [
//            { id: _.uniqueId(), name: 'Mark', position: $scope.positions[0], goals: 0 },
//            { id: _.uniqueId(), name: 'Cengiz', position: $scope.positions[2], goals: 2 },
//            { id: _.uniqueId(), name: 'Neymar', position: $scope.positions[3], goals: 7 }
          ];

          var players = $scope.$bus.publish(
            {
              channel: 'players',
              topic: 'player.list',
              data: {}
            }
          );
          console.log('players ->', players);

          $scope.savePlayer = function (player)
          {
            player.goals = (_.isUndefined(player.goals)) ? 0 : player.goals;

            if (player.id)
            {
              var players = $scope.players;

              _.find(
                players,
                function (_player) { return _player.id == player.id }
              );

              $scope.players = players;
            }
            else
            {
              $scope.players.push(
                {
                  id: _.uniqueId(),
                  name: player.name,
                  position: player.position,
                  goals: player.goals
                }
              );
            }

            $scope.player = {};
          };

          $scope.editPlayer = function (player)
          {
            $scope.player = player;
          };

          $scope.deletePlayer = function (id)
          {
            $scope.players = _.filter(
              $scope.players,
              function (player)
              {
                return player.id != id;
              }
            )
          };

          $scope.clearForm = function ()
          {
            $scope.player = {};
          };

          $scope.passIt = function ()
          {
            $scope.$bus.publish(
              {
                channel: 'orders',
                topic: 'order.new',
                data: {
                  name: 'Cengiz',
                  profession: 'Engineer'
                }
              }
            );
          };

        }
      ]
    );
  }
);