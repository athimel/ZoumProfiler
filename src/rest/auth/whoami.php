{"connected":<?php
session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {
    echo "true";

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $usersColl = $db->users;

    $user = $usersColl->findOne(array('_id' => $userId));
    unset($user['password']);
    echo ',"user":'.json_encode($user);
} else {
    echo "false";
}
?>
}