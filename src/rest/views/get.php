<?php header('Content-Type: application/json'); ?>
<?php

$m = new MongoClient();
$db = $m->zoumprofiler;

$viewsColl = $db->views;

$viewId = $_REQUEST["viewId"];

// find all views
$view = $viewsColl->findOne(array('_id' => new MongoId($viewId)));

echo json_encode($view);

?>