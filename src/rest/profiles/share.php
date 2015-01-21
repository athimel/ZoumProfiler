{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $shareUser = $_REQUEST["user"];
    $shareGroup = $_REQUEST["group"];
    $profileId = $_REQUEST["profileId"];

    $profilesColl = $db->profiles;

    if ($profileId) {
        $existingProfile = $profilesColl->findOne(array('_id' => new MongoId($profileId)));
        if ($existingProfile) {
            $internal = $existingProfile['_internal'];
            if ($internal['owner'] == $userId) {
                $shares = $internal['shares'];
                if (!$shares) {
                    $shares = array();
                }
                if ($shareGroup) {
                    array_push($shares, array('group' => $shareGroup));
                }
                if ($shareUser) {
                    array_push($shares, array('user' => new MongoId($shareUser)));
                }
                $existingProfile['_internal']['shares'] = $shares;
                $profilesColl->update(array('_id' => new MongoId($profileId)), $existingProfile);
                echo '"SHARED"';
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