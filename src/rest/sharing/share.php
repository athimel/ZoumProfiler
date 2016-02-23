<?php header('Content-Type: application/json'); ?>
{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

if ($userId) {

    include '../../config.php';

    $m = new MongoClient($mongoUrl);
    $db = $m->zoumprofiler;

    $shareUser = $_REQUEST["login"];
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
                $shares = $internal['shares'];
                if (!$shares) {
                    $shares = array();
                }
                if ($shareGroup) {
                    array_push($shares, array('group' => $shareGroup));
                }
                if ($shareUser) {
                    $usersColl = $db->users;
                    $user = $usersColl->findOne(array('login' => $shareUser));
                    array_push($shares, array('user' => $user['_id']));
                }
                $existingSharable['_internal']['shares'] = $shares;
                $sharableColl->update(array('_id' => new MongoId($sharableId)), $existingSharable);
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