<?php header('Content-Type: application/json'); ?>
{"groups":<?php
session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    include '../../config.php';

    $m = new MongoClient($mongoUrl);
    $db = $m->zoumprofiler;

    $usersColl = $db->users;

    $user = $usersColl->findOne(array('_id' => $userId));

    if (!$user['groups']) {
        $groups = array();
        $user['groups'] = array();
    }

    $group = $_REQUEST["group"];
    if ($group && !in_array($group, $user['groups'])) {
        array_push($user['groups'], $group);
        $usersColl->update(array('_id' => $userId), $user);
    }

    echo json_encode($user['groups']);
} else {
    echo "[]";
}
?>
}