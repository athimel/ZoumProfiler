<?php header('Content-Type: application/json'); ?>
{}<?php
$m = new MongoClient();
$db = $m->zoumprofiler;

$viewsColl = $db->views;

$viewId = $_REQUEST["viewId"];

$viewsColl->remove(array('_id' => new MongoId($viewId)));

?>