<?php header('Content-Type: application/json'); ?>
<?php
$login = $_REQUEST["login"];
$password = $_REQUEST["password"];

$m = new MongoClient();
$db = $m->zoumprofiler;

$usersColl = $db->users;

$passwordHash = hash('sha256',$password);
$users = $usersColl->find(array('login' => $login, 'password' => $passwordHash));

if ($users->count() > 0) {
    echo '{"authenticated":true}';
    $users->next();
    $user = $users->current();
    session_start();
    $_SESSION['authenticatedUserId'] = $user['_id'];
} else {
    echo '{"authenticated":false}';
}

?>
