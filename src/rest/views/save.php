<?php header('Content-Type: application/json'); ?>
{"result":<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

include '../../config.php';

$m = new MongoClient($mongoUrl);
$db = $m->zoumprofiler;

$viewJson = $_REQUEST["view"];

$viewsColl = $db->views;

$view = json_decode($viewJson, true);
unset($view['$$hashKey']);

$view['_internal'] = array();
if ($userId) {
    $view['_internal']['owner'] = new MongoId($userId);
} else {
    $view['_internal']['shares'] = array();
    array_push($view['_internal']['shares'], array('group' => "public"));
}

$viewsColl->insert($view);
echo '"CREATED","view":'.json_encode($view);

?>
}