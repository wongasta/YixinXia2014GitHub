<?php
session_start();

header('Content-type: application/javascript');

$requestType = $_GET["type"];
$requestCount = $_GET["count"];
$requestId = $_GET["id"];

require_once("twitteroauth/twitteroauth.php"); 

$consumerkey = "l3eRzucF9L3lR2oEqQVFws5ZI"; 
$consumersecret = "x9OYTIMMFjyHGOqAodUs0DJv4TnYHqoHEPkDbj8Md9mXLMwX27"; 
$accesstoken = "53006355-Wokd2v1wn15ywFI8tqXn4fFm3daxZK9ppZYNkNBCk"; 
$accesstokensecret = "AF3C58AcPeBODPZH3eLI6Yi2TSNq202Zx8z6mPTwPrDNg"; 

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