<?php header('Content-Type: application/json'); ?>
<?php
$login = $_REQUEST["login"];
$password = $_REQUEST["password"];

include '../../config.php';

$m = new MongoClient($mongoUrl);
$db = $m->zoumprofiler;

$usersColl = $db->users;

$users = $usersColl->find(array('login' => $login));

if ($users->count() > 0) {
    echo '{"registered":false,"reason":"ALREADY_EXISTS"}';
} else {
    $passwordHash = hash('sha256',$password);
    $usersColl->insert(array('login' => $login, 'password' => $passwordHash));
    echo '{"registered":true}';
}

?>
