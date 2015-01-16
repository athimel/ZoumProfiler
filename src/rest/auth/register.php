<?php
$login = $_REQUEST["login"];
$password = $_REQUEST["password"];

$m = new MongoClient();
$db = $m->zoumprofiler;

$usersColl = $db->users;

$users = $usersColl->find(array('login' => $login));

if ($users->count() > 0) {
    echo '{"registered":false}';
} else {
    $passwordHash = hash('sha256',$password);
    $usersColl->insert(array('login' => $login, 'password' => $passwordHash));
    echo '{"registered":true}';
}

?>
