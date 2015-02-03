<?php header('Content-Type: application/json'); ?>
{"result":<?php

$m = new MongoClient();
$db = $m->zoumprofiler;

$viewJson = $_REQUEST["view"];

$viewsColl = $db->views;

$view = json_decode($viewJson, true);
unset($view['$$hashKey']);
$viewsColl->insert($view);
echo '"CREATED","view":'.json_encode($view);

?>
}