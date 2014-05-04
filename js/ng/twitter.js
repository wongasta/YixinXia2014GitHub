var app = angular.module('ngAct', ['ngAnimate']);

//This controllers controls both click events of twitter and diablo... little organizational mistake hah
app.controller("ngActCtrl", function ($scope, twitterFormat, diabloCalls, diabloPush) {
    //twitter objects below
    //Main object contain tweet, friends, and followers
    $scope.tweetsArray = [];
    $scope.friendsArray = [];
    $scope.followersArray = [];

    //Hide show variables
    $scope.activated = 'none';
    $scope.twitterLoading = 0;
    $scope.totalLoaded = 0;

    $scope.getCounter = 0;

    //Click event for show tweets
    $scope.showTweet = function ($event) {
        $event.preventDefault();
        //Don't let user click twitter if they are on twitter already
        if ($scope.activated !== 'twitter') {
            $scope.activated = 'twitter';
            //calls outside of angular just for ONE thing
            activitiesModule.changeBGColor('#215668','#38768a');
            //prevent additional ajax calls if loaded already
            if($scope.twitterLoading != 2){
                $scope.twitterLoading = 1;
                $scope.diabloLoading = 0;

                //Get my tweets
                //$scope.getTweets();
                twitterFormat.getAllCalls().then(function (totalArray) {
                    twitterFormat.formatEachCalls($scope, totalArray);
                    $scope.twitterLoading = 2;
                });
            }
        }
    };

    $scope.allDone = function (service) {
        switch (service) {
            case 'tweet':
                return ($scope.twitterLoading === 2);
        }
    };

    //Diablo stuff below
    $scope.acctName = 'StallmanExp-1277';
    $scope.heroId = [];
    $scope.heroObjArray = [];
    $scope.itemCompleted = 0;

    $scope.showDiablo = function ($e) {
        $e.preventDefault();
        //prevent user from click on diablo if they're on diablo already
        if ($scope.activated !== 'diablo') {
            $scope.activated = 'diablo';
            //calls outside of angular just for ONE thing
            activitiesModule.changeBGColor('#252525','#3d3d3d');
            //prevent repeated loading of data
            if(($scope.heroObjArray.length===0) && ($scope.itemCompleted===0)){
                $scope.diabloLoading = 1;
                //Start diablo main function
                $scope.itemCompleted = 0;
                diabloCalls.getAcctDetails($scope.acctName).then(function (res) {
                    angular.forEach(res.data.heroes, function (val, i) {
                        $scope.heroId.push(val.id);
                    });
                    diabloPush.getHeroFromId($scope.heroId, $scope.acctName, $scope);
                });
            }
        }
    }



});

app.factory('twitterFormat', function ($q, twitterFac, commonFac) {
    return{
        getAllCalls: function () {
            return $q.all([
                twitterFac.getTwitterCall('tweet', 10),
                twitterFac.getTwitterCall('friend', 10),
                twitterFac.getTwitterCall('follower', 10)
            ]).then(function (data) {
                var aggData = [];
                angular.forEach(data, function (val, i) {
                    switch (i) {
                        case 0:
                            aggData.push(val.data);
                            break;
                        case 1 || 2:
                            aggData.push(val.data.users);
                            break;
                        case 2:
                            aggData.push(val.data.users);
                        default:
                            break;
                    }
                });
                return aggData;
            });
        },
        formatEachCalls: function ($scope, totalArray) {
            angular.forEach(totalArray, function (eachResponse, i) {
                switch (i) {
                    case 0:
                        angular.forEach(eachResponse, function (data, i) {
                            $scope.tweetsArray.push(
                                {
                                    'tweet': data.text,
                                    'time': commonFac.parseTwitterDate(data.created_at),
                                    'picture': data.user.profile_image_url
                                }
                            );
                        })
                        break;
                    case 1:
                        angular.forEach(eachResponse, function (data, i) {
                            $scope.friendsArray.push(
                                {
                                    'name': data.name,
                                    'screenname': data.screen_name,
                                    'description': data.description,
                                    'url': data.url,
                                    'picture': data.profile_image_url
                                }
                            );
                        });
                        break;
                    case 2:
                        angular.forEach(eachResponse, function (data, i) {
                            $scope.followersArray.push(
                                {
                                    'name': data.name,
                                    'screenname': data.screen_name,
                                    'description': data.description,
                                    'url': data.url,
                                    'picture': data.profile_image_url
                                }
                            );
                        });
                        break;

                    default:
                        break;
                }

            });
        }
    }
});

app.factory('twitterFac', function ($http) {
    return {
        getTwitterCall: function (type, count) {
            return $http.jsonp('http://yixinxia.com/rest/twitterget.php?type=' + type + '&count=' + count + '&callback=JSON_CALLBACK');
        }

    };
});

app.factory('commonFac', function () {
    return{
        parseTwitterDate: function (tdate) {
            var system_date = new Date(Date.parse(tdate));
            var user_date = new Date();
            var diff = Math.floor((user_date - system_date) / 1000);
            if (diff <= 1) {
                return "just now";
            }
            if (diff < 20) {
                return diff + " seconds ago";
            }
            if (diff < 40) {
                return "half a minute ago";
            }
            if (diff < 60) {
                return "less than a minute ago";
            }
            if (diff <= 90) {
                return "one minute ago";
            }
            if (diff <= 3540) {
                return Math.round(diff / 60) + " minutes ago";
            }
            if (diff <= 5400) {
                return "1 hour ago";
            }
            if (diff <= 86400) {
                return Math.round(diff / 3600) + " hours ago";
            }
            if (diff <= 129600) {
                return "1 day ago";
            }
            if (diff < 604800) {
                return Math.round(diff / 86400) + " days ago";
            }
            if (diff <= 777600) {
                return "1 week ago";
            }
            if (diff > 777600) {
                return "Forever ago";
            }
            return "on " + system_date;
        }
    }
});


