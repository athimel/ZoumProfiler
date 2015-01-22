<?php header('Content-Type: application/json'); ?>
{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $profileJson = $_REQUEST["profile"];
    $profileId = $_REQUEST["profileId"];

    $profilesColl = $db->profiles;

    if ($profileId) {
        $existingProfile = $profilesColl->findOne(array('_id' => new MongoId($profileId)));
        if ($existingProfile) {
            if ($existingProfile['_internal']['owner'] == $userId) {
                $internal = $existingProfile['_internal'];
                $profile = json_decode($profileJson, true);
                $existingProfile = array_replace_recursive($existingProfile, $profile);
                $existingProfile['_internal'] = $internal;
                $profilesColl->update(array('_id' => new MongoId($profileId)), $existingProfile);
                echo '"UPDATED","profile":'.json_encode($existingProfile);
            } else {
                echo '"FORBIDDEN"';
            }
        } else {
            echo '"NOT_FOUND"';
        }
    } else {
        $profile = json_decode($profileJson, true);
        $profile['_internal'] = array();
        $profile['_internal']['owner'] = new MongoId($userId);
        $profilesColl->insert($profile);
        echo '"CREATED","profile":'.json_encode($profile);
    }

} else {
    echo '"NOT_AUTHENTICATED"';
}

?>
}