<?php header('Content-Type: application/json'); ?>
{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $profileId = $_REQUEST["profileId"];

    $profilesColl = $db->profiles;

    if ($profileId) {
        $existingProfile = $profilesColl->findOne(array('_id' => new MongoId($profileId)));
        if ($existingProfile) {
            if ($existingProfile['_internal']['owner'] == $userId) {
                $profilesColl->remove(array('_id' => new MongoId($profileId)));
                echo '"DELETED"';
            } else {
                echo '"FORBIDDEN"';
            }
        } else {
            echo '"NOT_FOUND"';
        }
    } else {
        echo '"BAD_REQUEST"';
    }

} else {
    echo '"NOT_AUTHENTICATED"';
}

?>
}
