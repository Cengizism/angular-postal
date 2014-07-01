define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Diagnostics',
      [
        '$rootScope',
        function ($rootScope)
        {
          return {
            initialize: function (logs)
            {
              $rootScope.logs = {};

              _.each(
                logs,
                function (filters, name)
                {
                  if (_.isUndefined($rootScope.logs[name]))
                  {
                    $rootScope.logs[name] = {};
                  }

                  $rootScope.logs[name].self = new $rootScope.$bus.diagnostics(
                    {
                      name: name,
                      filters: filters,
                      writer: function (message)
                      {
                        if (_.isUndefined($rootScope.logs[name].list))
                        {
                          $rootScope.logs[name].list = [];
                        }

                        $rootScope.logs[name].list.unshift(
                          angular.extend(
                            angular.fromJson(message),
                            { fold: false }
                          )
                        );
                      }
                    }
                  )
                }
              );

            }
          };
        }
      ]
    );
  }
);