{"connected":<?php
session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {
    echo "true";

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $usersColl = $db->users;

    $users = $usersColl->find(array('_id' => $userId));
    foreach ($users as $user) {
        unset($user['password']);
        echo ',"profile":'.json_encode($user);
    }
} else {
    echo "false";
}
?>
}