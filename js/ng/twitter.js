var app = angular.module('ngAct', ['ngAnimate']);


app.controller("ngActCtrl", function ($scope, $q, twitterFac, twitterPush) {
    //Main object contain tweet, friends, and followers
    $scope.tweetsArray = [];
    $scope.friendsArray = [];
    $scope.followersArray = [];

    //Hide show variables
    $scope.activated = 'none';
    $scope.twitterLoading = false;
    $scope.totalLoaded = 0;

    $scope.getCounter = 0;

    //Click event for show tweets
    $scope.showDiv = function ($event) {
        if ($scope.activated !== 'twitter') {
            $scope.activated = 'twitter';
            $scope.twitterLoading = ! $scope.twitterLoading;
            //Get my tweets
            //$scope.getTweets();
            twitterPush.getTweets($scope);
            twitterPush.getFriends($scope);
            twitterPush.getFollowers($scope);
        }
        $event.preventDefault();
    };

    $scope.allDone = function(){
        if ($scope.getCounter === 3){
            return true;
        }else{
            return false;
        }
    }

});

app.factory('twitterPush', function(twitterFac, commonFac) {
    return {
        getTweets: function ($scope) {
            twitterFac.getTwitterCall('tweet', 10).success(function (data) {
                for(var i=0; i<data.length; i++){
                    $scope.tweetsArray.push(
                        {
                            'tweet': data[i].text,
                            'time': commonFac.parseTwitterDate(data[i].created_at),
                            'picture': data[i].user.profile_image_url
                        }
                    );
                }
                $scope.getCounter++;
                console.log($scope.getCounter);
            });
        },
        getFriends: function ($scope) {
            twitterFac.getTwitterCall('friend', 10).success(function (data) {

                for(var i=0; i<data.users.length; i++){
                    $scope.friendsArray.push(
                        {
                            'name': data.users[i].name,
                            'screenname': data.users[i].screen_name,
                            'description': data.users[i].description,
                            'url': data.users[i].url,
                            'picture': data.users[i].profile_image_url
                        }
                    );
                }
                $scope.getCounter++;
                console.log($scope.getCounter);
            });
        },
        getFollowers: function ($scope) {
            twitterFac.getTwitterCall('follower', 10).success(function (data) {

                for(var i=0; i<data.users.length; i++){
                    $scope.followersArray.push(
                        {
                            'name': data.users[i].name,
                            'screenname': data.users[i].screen_name,
                            'description': data.users[i].description,
                            'url': data.users[i].url,
                            'picture': data.users[i].profile_image_url
                        }
                    );
                }
                $scope.getCounter++;
                console.log($scope.getCounter);
            });
        }
    };
});

app.factory('twitterFac', function ($http) {
    return {
        getTwitterCall: function (type, count) {
            return $http.jsonp('/rest/twitterget.php?type='+type+'&count='+count+'&callback=JSON_CALLBACK');
        }

    };
});

app.factory('commonFac', function() {
    return{
        parseTwitterDate: function(tdate) {
            var system_date = new Date(Date.parse(tdate));
            var user_date = new Date();
            var diff = Math.floor((user_date - system_date) / 1000);
            if (diff <= 1) {return "just now";}
            if (diff < 20) {return diff + " seconds ago";}
            if (diff < 40) {return "half a minute ago";}
            if (diff < 60) {return "less than a minute ago";}
            if (diff <= 90) {return "one minute ago";}
            if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
            if (diff <= 5400) {return "1 hour ago";}
            if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
            if (diff <= 129600) {return "1 day ago";}
            if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
            if (diff <= 777600) {return "1 week ago";}
            if (diff > 777600) {return "Forever ago";}
            return "on " + system_date;
        }
    }
});


