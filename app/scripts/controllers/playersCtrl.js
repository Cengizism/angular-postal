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

          var players = $scope.$bus.channel('players');

          $scope.teams = [];

          var teams = $scope.$bus.channel('teams');

          $timeout(
            function ()
            {
              teams.publish(
                'team.list',
                function (list) { $scope.teams = list }
              );
            }
          );

          $scope.Player = {
            list: function ()
            {
              players.publish(
                'player.list',
                function (list) { $scope.players = list }
              );
            },
            save: function (player)
            {
              players.publish(
                {
                  topic: 'player.save',
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
                  topic: 'player.remove',
                  data: {
                    id: id,
                    callback: function () { this.list() }.bind(this)
                  }
                }
              );
            },
            edit: function (player) { $scope.player = angular.extend({}, player) }
          };

          $timeout(function() { $scope.Player.list() });

          $scope.clearForm = function () { $scope.player = {} };


          //          // FOr testing promised pub/sub only for the moment
          //          $scope.promised = 'Loading promised..';
          //
          //          players.request(
          //            {
          //              topic: "last.login",
          //              data: { userId: 8675309 },
          //              timeout: 5000
          //            }
          //          ).then(
          //            function (data)
          //            {
          //              $scope.promised = 'Last login for userId: ' + data.userId + ' occurred on ' + data.time;
          //            },
          //            function (err)
          //            {
          //              $scope.promised = 'Uh oh! Error: ' + err;
          //            }
          //          );
          //
          //          // console.log('postal ->', $scope.$bus);
          //
          //
          //          $scope.showWiretaps = function ()
          //          {
          //            console.log('wiretaps ->', $scope.$bus.wiretaps);
          //          };
          //
          //          $scope.unsubscribeSavers = function ()
          //          {
          //            players.publish(
          //              {
          //                topic: 'player.block.save',
          //                data: {
          //                  callback: function (result) { console.log('result ->', result) }
          //                }
          //              }
          //            );
          //          };


        }
      ]
    );
  });