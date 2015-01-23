<?php header('Content-Type: application/json'); ?>
{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $shareUser = $_REQUEST["userId"];
    $shareGroup = $_REQUEST["group"];
    $profileId = $_REQUEST["profileId"];

    $profilesColl = $db->profiles;

    if ($profileId) {
        $existingProfile = $profilesColl->findOne(array('_id' => new MongoId($profileId)));
        if ($existingProfile) {
            $internal = $existingProfile['_internal'];
            if ($internal['owner'] == $userId) {
                if ($internal['shares']) {
                    $newShares = array();
                    foreach ($internal['shares'] as $share) {
                        if ($share['group'] && (!$shareGroup || $share['group'] != $shareGroup)) {
                            array_push($newShares, $share);
                        }
                        if ($share['user'] && (!$shareUser || $share['user'] != $shareUser)) {
                            array_push($newShares, $share);
                        }
                    }
                    $existingProfile['_internal']['shares'] = $newShares;
                    $profilesColl->update(array('_id' => new MongoId($profileId)), $existingProfile);
                }
                echo '"UNSHARED"';
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