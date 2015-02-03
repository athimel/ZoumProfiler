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
        echo "    ".json_encode($view);
        if ($views->hasNext()) {
            echo ",";
        }
        echo "\n";
    }
?>  ]
}
