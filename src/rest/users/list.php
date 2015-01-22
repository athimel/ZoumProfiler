<?php header('Content-Type: application/json'); ?>
{"users":<?php

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $usersColl = $db->users;

    $users = $usersColl->find();
    $usersArray = array();
    foreach ($users as $user) {
        unset($user['password']);
        array_push($usersArray, $user);
    }
    echo json_encode($usersArray);
?>
}