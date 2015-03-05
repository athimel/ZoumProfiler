<?php header('Content-Type: application/json'); ?>
{"result":<?php

$m = new MongoClient();
$db = $m->zoumprofiler;

$viewsColl = $db->views;

$viewId = $_REQUEST["viewId"];

if ($viewId) {
    $existingView = $viewsColl->findOne(array('_id' => new MongoId($viewId)));
    if ($existingView) {

        session_start();
        $userId = $_SESSION['authenticatedUserId'];

        if ($existingView['_internal']['owner'] == $userId || !$existingView['_internal']['owner']) {
            $viewsColl->remove(array('_id' => new MongoId($viewId)));
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

?>
}