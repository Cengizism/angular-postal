define(
  ['app', 'config'],
  function (app, config)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$q', 'Broker', 'Store', 'Team', 'Player',
        function ($rootScope, $q, Broker, Store, Team, Player)
        {
          // TODO: Bootstrap ap with sample data

          // TODO: Maybe simplify module declarations?
          Broker.initialize(
            {
              modules: {
                teams: Team,
                players: Player
              },
              logs: ['teams', 'players']
            }
          );

          Broker.link(
            {
              channel: 'players',
              topic: 'players.promised.list'
            },
            // TODO: Remove testing later!
            {
              channel: 'testing',
              topic: 'tested.method'
            }
          );

          $rootScope.privilage = function (channel, event, state)
          {
            if (channel == '*')
            {
              switch (event)
              {
                case 'save':
                  $rootScope.broker.auth.players['players.save'] = state;
                  $rootScope.broker.auth.teams['teams.save'] = state;

                  if (state)
                  {
                    Broker.enable('players', 'players.save');
                    Broker.enable('teams', 'teams.save');
                  }
                  else
                  {
                    Broker.disable('players', 'players.save');
                    Broker.disable('teams', 'teams.save');
                  }
                  break;
                case 'remove':
                  $rootScope.broker.auth.players['players.remove'] = state;
                  $rootScope.broker.auth.teams['teams.remove'] = state;

                  if (state)
                  {
                    Broker.enable('players', 'players.remove');
                    Broker.enable('teams', 'teams.remove');
                  }
                  else
                  {
                    Broker.disable('players', 'players.remove');
                    Broker.disable('teams', 'teams.remove');
                  }
                  break;
              }
            }
            else
            {
              if (!$rootScope.broker.auth[channel][event])
              {
                Broker.disable(channel, event);
              }
              else
              {
                Broker.enable(channel, event);
              }
            }
          };

          /**
           * ---------------------------------------------------------------------------------
           */
          // TODO: Better reporting cross matched with active ones!
          $rootScope.showSubscriptions = function ()
          {
            console.log('teams ->', Broker.subscriptions.teams);
            console.log('players ->', Broker.subscriptions.players);
            console.log('broker ->', $rootScope.broker);
          };

          $rootScope.unsubscribeSavers = function ()
          {
            Broker.disable('players', 'players.save');
          };

          $rootScope.registerSubscriptions = function ()
          {
            Broker.enable('players', 'players.save');
          };

          $rootScope.nuke = function () { Broker.reset() };

          angular.element('#wrap').show();

          // Scaffold some data if they do not exist
          var teams = [
            { id: 1, name: 'Barcelona' },
            { id: 2, name: 'Real Madrid' }
          ];

          var players = [
            {
              id: 1,
              name: 'Di Maria',
              position: 3,
              goals: 5,
              team: 2
            },
            {
              id: 2,
              name: 'Messi',
              position: 2,
              goals: 9,
              team: 1
            },
            {
              id: 3,
              name: 'Ronaldo',
              position: 3,
              goals: 8,
              team: 2
            }
          ];

          _.each(
            teams,
            function (team)
            {
              Store('teams').save(
                team.id,
                {
                  id: team.id,
                  name: team.name
                }
              );
            }
          );

          _.each(
            players,
            function (player)
            {
              Store('players').save(
                player.id,
                {
                  id: player.id,
                  name: player.name,
                  position: config.app.positions[player.position],
                  goals: player.goals,
                  team: player.team
                }
              );
            }
          )
        }
      ]
    );
  }
);