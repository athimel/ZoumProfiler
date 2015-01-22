<?php header('Content-Type: application/json'); ?>
{"groups":<?php
session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $usersColl = $db->users;

    $user = $usersColl->findOne(array('_id' => $userId));

    $group = $_REQUEST["group"];
    if ($user['groups'] && $group && in_array($group, $user['groups'])) {
        $newGroups = array();
        foreach ($user['groups'] as $userGroup) {
            if ($group != $userGroup) {
                array_push($newGroups, $userGroup);
            }
        }
        $user['groups'] = $newGroups;
        $usersColl->update(array('_id' => $userId), $user);
    }

    echo json_encode($user['groups']);
} else {
    echo "[]";
}
?>
}