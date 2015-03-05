<?php header('Content-Type: application/json'); ?>
{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    $m = new MongoClient();
    $db = $m->zoumprofiler;

    $shareUser = $_REQUEST["userId"];
    $shareGroup = $_REQUEST["group"];
    $sharableId = $_REQUEST["sharableId"];

    if ($_REQUEST["sharableType"] == "view") {
        $sharableColl = $db->views;
    } else {
        $sharableColl = $db->profiles;
    }

    if ($sharableId) {
        $existingSharable = $sharableColl->findOne(array('_id' => new MongoId($sharableId)));
        if ($existingSharable) {
            $internal = $existingSharable['_internal'];
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
                    $existingSharable['_internal']['shares'] = $newShares;
                    $sharableColl->update(array('_id' => new MongoId($sharableId)), $existingSharable);
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