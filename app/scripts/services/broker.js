define(
  ['services/services', 'postal', 'diagnostics'],
  function (services, postal, diagnostics)
  {
    'use strict';

    services.service(
      'Broker',
      [
        '$rootScope', '$q', '$timeout',
        function ($rootScope, $q, $timeout)
        {
          return {
            setup: {},

            initialize: function (setup)
            {
              // console.log('this init ->', this);

              this.setup = setup;

              // console.log('after ->', this);

              postal.configuration.DEFAULT_CHANNEL = '/';
              postal.configuration.SYSTEM_CHANNEL = 'root';
              postal.configuration.promise.createDeferred = function () { return $q.defer() };
              postal.configuration.promise.getPromise = function (deferred) { return deferred.promise };

              $rootScope.broker = {
                setup: this.setup,
                channels: {},
                swap: {},
                logs: {
                  system: [
                    { channel: postal.configuration.SYSTEM_CHANNEL }
                  ],
                  actions: []
                },
                auth: {},
                privilage: this.privilage
              };

              _.each(
                this.setup.logs,
                function (log) { $rootScope.broker.logs.actions.push({ channel: log }) }
              );

              this.setup.hasOwnProperty('logs') && this.diagnostics($rootScope.broker.logs);

              this.build();
            },

            build: function ()
            {
              $timeout(
                function ()
                {
                  _.each(
                    this.setup.modules,
                    function (modal, channel)
                    {
                      $rootScope.broker.channels[channel] = $rootScope.$bus.channel(channel);

                      $rootScope.broker.swap[channel] = {};

                      $rootScope.broker.auth[channel] = {};

                      _.each(
                        modal,
                        function (callback, action)
                        {
                          var key = Object.keys(callback)[0];

                          var details = {
                            event: '',
                            callback: callback[key]
                          };

                          switch (action)
                          {
                            case 'promised':
                              details.event = channel + '.promised.' + key;
                              break;

                            case 'all':
                              details.event = '*.' + key;
                              break;

                            default:
                              details = {
                                event: channel + '.' + action,
                                callback: (callback.hasOwnProperty('self') || ! _.isFunction(callback)) ?
                                          callback.self :
                                          callback
                              };
                          }

                          this.register(channel, details.event, details.callback);

                          if (! _.isFunction(callback))
                          {
                            _.each(
                              callback,
                              function (callback, stack)
                              {
                                var subscription = $rootScope.broker.swap[channel][details.event];


                                switch (stack)
                                {
                                  // allows you to add a custom "pre-subscription-invocation" step which
                                  // fires before every message is processed.
                                  case 'before':
                                    subscription.before(callback);
                                    break;

                                  // allows you to add a custom "post-subscription-invocation" step which
                                  // fires after every message has been processed.
                                  case 'after':
                                    subscription.after(callback);
                                    break;

                                  // catch(function(err) { */do something with err */ }); - allows you to add
                                  // an error handler that will be invoked if an exception is thrown in the
                                  // subscription callback (this wraps the subscription callback invocation in
                                  // a try/catch).
                                  case 'catch':
                                    subscription.catch(callback);
                                    break;

                                  // configuration method that causes the subscription callback to be fired only
                                  // when the current stack has cleared. It's equivalent to setTimeout( callback, 0 );.
                                  case 'defer':
                                    if (callback)
                                    {
                                      subscription.defer();
                                    }
                                    break;

                                  // disposeAfter( num ) - where the num argument is an integer value indicating
                                  // the number of times you want the subscription callback to be invoked before
                                  // auto-unsubscribing.
                                  case 'disposeAfter':
                                    if (callback && typeof callback == 'number')
                                    {
                                      subscription.disposeAfter(callback);
                                    }
                                    break;

                                  // configuration method that causes identical messages to be ignored, firing the
                                  // callback only once new data is published.
                                  case 'distinct':
                                    if (callback)
                                    {
                                      subscription.distinct();
                                    }
                                    break;

                                  // configuration method that causes identical consecutive messages to be
                                  // ignored, firing the callback only once new data is published.
                                  case 'distinctUntilChanged':
                                    if (callback)
                                    {
                                      subscription.distinctUntilChanged();
                                    }
                                    break;

                                  // configuration method that causes the subscription to unsubscribe after it
                                  // receives one message.
                                  case 'once':
                                    if (callback)
                                    {
                                      subscription.once();
                                    }
                                    break;

                                  // withConstraint( predicate ) where the predicate argument is a function
                                  // that returns true if the callback should fire, or false if it should not.
                                  // The predicate takes two args: predicate( data, envelope );
                                  case 'withConstraint':
                                    subscription.withConstraint(callback);
                                    break;

                                  // withConstraints( [ predicate1, predicate2 ] ) - same as withConstraint,
                                  // except it takes an array of predicates, not just one.
                                  case 'withConstraints':
                                    subscription.withConstraints(callback);
                                    break;

                                  // withDebounce( interval ) - where the interval argument is the milliseconds
                                  // interval to use for debouncing the subscription callback. A debounced
                                  // subscription will not fire the callback until after the interval has
                                  // elapsed. If new messages arrive before the interval has elapsed, it starts over.
                                  case 'withDebounce':
                                    if (callback && typeof callback == 'number')
                                    {
                                      subscription.withDebounce(callback);
                                    }
                                    break;

                                  // withDelay( waitTime ) - where waitTime is the milliseconds interval to delay
                                  // every callback invocation. This is equivalent to a
                                  // setTimeout( callback, interval ).
                                  case 'withDelay':
                                    if (callback && typeof callback == 'number')
                                    {
                                      subscription.withDelay(callback);
                                    }
                                    break;

                                  // withThrottle( interval ) - where the interval argument is an integer
                                  // specifying a time interval in milliseconds during which the callback should
                                  // only be fired once.
                                  case 'withThrottle':
                                    if (callback && typeof callback == 'number')
                                    {
                                      subscription.withThrottle(callback);
                                    }
                                    break;
                                }

                              }
                            );
                          }
                        }.bind(this)
                      );
                    }.bind(this)
                  );

                  console.log('broker ->', $rootScope.broker);
                  console.log('-------------------------------------------------------------------------');

                }.bind(this)
              );
            },

            subscriptions: (function () { return postal.subscriptions })(),

            register: function (channel, event, callback)
            {
              $rootScope.broker.swap[channel][event] = $rootScope.broker.channels[channel].subscribe(event, callback);

              $rootScope.broker.auth[channel][event] = true;
            },

            disable: function (channel, event) { postal.unsubscribe(this.subscriptions[channel][event][0]) },

            enable: function (channel, event)
            {
              var subscription = $rootScope.broker.swap[channel][event];

              this.subscriptions[channel][event].push(subscription);
            },

            reset: function () { postal.reset() },

            link: function (original, target) { postal.linkChannels(original, target) },

            privilage: function (auth, channel, event) { },

            diagnostics: function (logs)
            {
              $rootScope.broker.logs = {};

              _.each(
                logs,
                function (filters, name)
                {
                  if (_.isUndefined($rootScope.broker.logs[name]))
                  {
                    $rootScope.broker.logs[name] = {};
                  }

                  $rootScope.broker.logs[name].self = new diagnostics(
                    {
                      name: name,
                      filters: filters,
                      writer: function (message)
                      {
                        if (_.isUndefined($rootScope.broker.logs[name].list))
                        {
                          $rootScope.broker.logs[name].list = [];
                        }

                        var log = angular.fromJson(message);

                        $rootScope.broker.logs[name].list.unshift(
                          angular.extend(
                            log,
                            {
                              fold: false,
                              empty: _.isEmpty(log.data),
                              auth: ! ((log.channel != postal.configuration.SYSTEM_CHANNEL &&
                                        postal.subscriptions[log.channel][log.topic].length == 0))
                            }
                          )
                        );
                      }
                    }
                  )
                }
              );
            },

            tap: function ()
            {
              /**
               * Add a wiretap
               */
              //                var tap = postal.addWireTap(
              //                  function (data, envelope) { console.log('wired: ', JSON.stringify(envelope)) }
              //                );
              // Remove the tap
              // tap();
            }
          };
        }
      ]
    );
  }
);