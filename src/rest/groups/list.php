<?php header('Content-Type: application/json'); ?>
<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

include '../../config.php';

$m = new MongoClient($mongoUrl);$db = $m->zoumprofiler;

$profilesColl = $db->profiles;

// find distinct groups
$groups = $profilesColl->distinct("_internal.shares.group");

?>{
  "groups":<?php
    echo json_encode($groups);
?>}
