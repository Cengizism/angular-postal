define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'playersCtrl',
      [
        '$scope', '$timeout',
        function ($scope, $timeout)
        {
          // console.log('wiretaps ->', $scope.$bus.wiretaps);

          $scope.positions = config.app.positions;

          $scope.player = {};

          $scope.players = [];
          $scope.teams = [];

          var players = $scope.$bus.channel('players');
          var teams = $scope.$bus.channel('teams');

          $timeout(
            function ()
            {
              teams.publish(
                'teams.list',
                function (list) { $scope.teams = list }
              );
            }
          );

          players.subscribe(
            'players.team.list',
            function ()
            {
              teams.publish(
                'teams.list',
                function (list) { $scope.teams = list }
              );
            }
          );

          $scope.Player = {
            list: function ()
            {
//              players.publish(
//                'players.list',
//                function (list) { $scope.players = list }
//              );

              $scope.promised = 'Loading promised..';

              players.request(
                {
                  topic: 'players.promised.list',
                  timeout: 2
                }
              ).then(
                function (data)
                {
                  $scope.players = data.list;

                  $scope.promised = 'data loaded';
                },
                function (err)
                {
                  $scope.promised = 'Uh oh! Error: ' + err;
                }
              );

            },
            save: function (player)
            {
              players.publish(
                {
                  topic: 'players.save',
                  data: {
                    player: player,
                    callback: function () { this.list() }.bind(this)
                  }
                }
              );

              $scope.player = {};
            },
            remove: function (id)
            {
              players.publish(
                {
                  topic: 'players.remove',
                  data: {
                    id: id,
                    callback: function () { this.list() }.bind(this)
                  }
                }
              );
            },
            edit: function (player) { $scope.player = angular.extend({}, player) }
          };

          $timeout(function () { $scope.Player.list() });

          $scope.clearForm = function () { $scope.player = {} };

        }
      ]
    );
  }
);