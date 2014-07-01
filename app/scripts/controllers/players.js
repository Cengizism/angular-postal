define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'players',
      [
        '$scope', 'Broker',
        function ($scope, Broker)
        {
          $scope.positions = config.app.positions;
          $scope.player = {};
          $scope.players = [];

          var players = $scope.$bus.channel('players');

//          console.log('wiretaps ->', $scope.$bus.wiretaps);

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
//          $scope.showSubscriptions = function ()
//          {
//            console.log('subscriptions ->', $scope.$bus.subscriptions);
//          };
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