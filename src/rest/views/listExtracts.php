<?php header('Content-Type: application/json'); ?>
<?php

$m = new MongoClient();
$db = $m->zoumprofiler;

$viewsColl = $db->views;

// find all views
$views = $viewsColl->find();

?>{
  "views":[
<?php
    // iterate through the results
    foreach ($views as $view) {
        $viewExtract = array();
        $viewExtract["_id"] = $view["_id"];
        $viewExtract["trollId"] = $view["trollId"];
        $viewExtract["date"] = $view["date"];
        $viewExtract["scope"] = $view["scope"];
        if (!$view["scope"] && $view["distance"]) {
            $viewExtract["scope"] = $view["distance"];
        }
        $viewExtract["origin"] = $view["origin"];
        echo "    ".json_encode($viewExtract);
        if ($views->hasNext()) {
            echo ",";
        }
        echo "\n";
    }
?>  ]
}
