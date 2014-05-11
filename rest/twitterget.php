<?php
session_start();

header('Content-type: application/javascript');

$requestType = $_GET["type"];
$requestCount = $_GET["count"];
$requestId = $_GET["id"];

require_once("twitteroauth/twitteroauth.php"); 

$consumerkey = ""; 
$consumersecret = ""; 
$accesstoken = ""; 
$accesstokensecret = ""; 

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

if( $requestType=='tweet' ){
	$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=".$requestId."&count=".$requestCount);
}elseif ( $requestType=='follower' ){
	$tweets = $connection->get("https://api.twitter.com/1.1/followers/list.json?user_id=".$requestId."&count=".$requestCount);
}elseif ( $requestType=='friend' ){
	$tweets = $connection->get("https://api.twitter.com/1.1/friends/list.json?user_id=".$requestId."&count=".$requestCount);
}else{
	$tweets = 'Unknown';
}


echo $_GET['callback'] . '('.json_encode($tweets).')';
?>